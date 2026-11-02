import assert from "node:assert/strict";
import { before, describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1483-commerce-detail-habillement-textiles";
const value = "commerce de détail habillement";
const namespace = `salarié . convention collective . ${value}`;

async function rulesOf(revision: string) {
  const found = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === revision);
  assert.ok(found, revision);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], value],
  } as Rule;
  Object.assign(rules, await found.loadRules());
  return { found, rules };
}

const { rules: rules2026_2 } = await rulesOf("2026.3");
const { found: version2026_5, rules: rules2026_5 } = await rulesOf("2026.7");
let rules = rules2026_2;
const makeEngine = () => new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
let engine = makeEngine();

function setSituation(level: string, years = 0, department = "Mayotte", quota = "100%") {
  engine = makeEngine();
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${level}'`,
    "salarié . ancienneté": `${years} an`,
    "salarié . contrat . temps de travail . quotité": quota,
    "établissement . commune . département": `'${department}'`,
  });
}

function amount(rule: string) {
  const result = engine.evaluate(`${namespace} . ${rule}`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const minimum = () => amount("salaire minimum conventionnel");

/**
 * 2026.7 replaces 2026.7: the Mayotte grid of 2026.3 and 2026.7 came from a secondary source. The
 * extended accord is the one of 17 June 2026 (order of 22 September 2026, JORFTEXT000054914202),
 * whose text is not published: in Mayotte, no agreement minimum and no seniority bonus.
 */
describe("IDCC 1483 — 2026.7 without the unpublished Mayotte grid", () => {
  before(() => {
    rules = rules2026_5;
  });

  it("starts on 1 October 2026 and cites the accord of 17 June 2026 and its extension", () => {
    assert.equal(version2026_5.validFrom, "2026-10-01");
    assert.ok(version2026_5.sources.some((source) => source.includes("17 juin 2026") && source.includes("JORFTEXT000054914202")));
    assert.ok(!version2026_5.sources.some((source) => source.includes("12 juin 2026")));
  });

  it("has no agreement minimum and no seniority bonus in Mayotte", () => {
    for (const [level, years] of [["1", 0], ["3", 9], ["A2", 18], ["B", 3], ["D", 18]] as const) {
      setSituation(level, years);
      assert.equal(minimum(), 0, level);
      assert.equal(amount("prime d'ancienneté"), 0, level);
      assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, false, level);
    }
  });

  it("still rejects a category that is not in the grid in Mayotte", () => {
    setSituation("ZZ");
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, true);
  });

  it("keeps the national grid and seniority bonus outside Mayotte", () => {
    setSituation("3", 9, "La Réunion");
    assert.equal(minimum(), 1843);
    assert.equal(amount("prime d'ancienneté"), 65);
    setSituation("B", 3, "La Réunion");
    assert.equal(minimum(), 2629);
  });
});

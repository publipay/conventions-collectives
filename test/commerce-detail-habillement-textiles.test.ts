import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1483-commerce-detail-habillement-textiles";
const value = "commerce de détail habillement";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.3");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = {
  ...choice,
  "une possibilité": [...choice["une possibilité"], value],
} as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

/** Minimum remuneration for 151.67 hours, article 1 of avenant n° 29 of 16 December 2025. */
const GRID: Record<string, number> = {
  "1": 1828, "2": 1833, "3": 1843, "4": 1857, "5": 1878, "6": 1915, "7": 1974, "8": 2043,
  A1: 2158, A2: 2262, B: 2579, C: 4005, D: 4164,
};

/** Minimum remuneration of B, C and D from 3 years of seniority, in steps of 3 years. */
const SENIORITY: Record<string, number[]> = {
  B: [2629, 2644, 2659, 2674, 2689, 2704],
  C: [4055, 4070, 4085, 4100, 4115, 4130],
  D: [4214, 4229, 4244, 4259, 4274, 4289],
};

/** Completed years of seniority, as modele-social counts them (`salarié . ancienneté`). */
function setSituation(level: string | undefined, years = 0, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    "salarié . ancienneté": `${years} an`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 1483 — 2026.3 minimum salaries", () => {
  it("is in force from 1 April 2026 and cites the avenant and its extension order", () => {
    assert.equal(version.validFrom, "2026-04-01");
    assert.ok(version.sources.some((source) => source.includes("Avenant n° 29 du 16 décembre 2025")));
    assert.ok(version.sources.some((source) => source.includes("arrêté du 9 mars 2026")));
    assert.ok(version.sources.some((source) => source.includes("TRST2606578A")));
  });

  it("has 13 categories: 8 employees, 3 supervisors and 2 executives", () => {
    assert.equal(Object.keys(GRID).length, 13);
  });

  for (const [level, expected] of Object.entries(GRID)) {
    it(`${level}: ${expected} € a month below 3 years of seniority`, () => {
      for (const years of [0, 1, 2.9]) {
        setSituation(level, years);
        assert.equal(minimum(), expected, `${years} years`);
      }
      assert.equal(outOfGrid(), false);
    });
  }

  for (const [level, amounts] of Object.entries(SENIORITY)) {
    amounts.forEach((amount, index) => {
      const years = 3 * (index + 1);
      it(`${level}: ${amount} € from ${years} years of seniority`, () => {
        setSituation(level, years);
        assert.equal(minimum(), amount);
        setSituation(level, years + 2.9);
        assert.equal(minimum(), amount);
      });
    });

    it(`${level}: keeps the 18 year minimum beyond 18 years`, () => {
      setSituation(level, 30);
      assert.equal(minimum(), amounts[5]);
    });
  }

  it("rejects categories outside the grid", () => {
    for (const level of ["0", "9", "A", "A3", "E", "a1", "b", "non renseigné"]) {
      setSituation(level, 6);
      assert.equal(outOfGrid(), true, level);
      assert.equal(minimum(), 0, level);
    }
  });

  it("reports a missing category as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("3");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . niveau hors grille`).nodeValue, null);
  });
});

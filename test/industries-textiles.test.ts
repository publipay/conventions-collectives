import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0018-industries-textiles";
const value = "industries textiles";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.2");
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

/** Monthly minimums of the accord of 17 June 2026, by level and step. */
const MONTHLY: Record<string, number> = {
  "1": 1898,
  "2.1": 1901,
  "2.2": 1906,
  "2.3": 1915,
  "3.1": 1916,
  "3.2": 1920,
  "3.3": 1931,
  "4.1": 1933,
  "4.2": 1996,
  "4.3": 2080,
  "5.1": 2087,
  "5.2": 2143,
  "5.3": 2293,
  "6.1": 2304,
  "6.2": 2420,
  "6.3": 2615,
  "I.1": 2620,
  "I.2": 2923,
  "II": 3527,
  "III": 4280,
  "IV": 5029,
};

function setSituation(level: string | undefined, quota?: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": quota }),
  });
}

const amount = () => {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
};

const outOfGrid = () => engine.evaluate(`${namespace} . niveau hors grille`).nodeValue;

describe("IDCC 18 — 2026.2 minimum salaries", () => {

  it("has 21 positions", () => {
    assert.equal(Object.keys(MONTHLY).length, 21);
  });

  it("rejects levels outside the grid", () => {
    for (const level of ["0", "1.1", "2", "2.4", "7.1", "I", "I.3", "V", "i.1", "A", "non renseigné"]) {
      setSituation(level);
      assert.equal(outOfGrid(), true, level);
      assert.equal(amount(), 0, level);
    }
  });

  it("reports a missing level as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(amount(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("4.2");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    for (const name of ["salaire minimum conventionnel", "niveau hors grille"]) {
      assert.equal(engine.evaluate(`${namespace} . ${name}`).nodeValue, null, name);
    }
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0493-vins-cidres-spiritueux";
const value = "vins cidres spiritueux";
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

const GRID: Record<string, number> = {
  "1A": 1844,
  "1B": 1879,
  "1C": 1913,
  "2A": 1923,
  "2B": 1954,
  "2C": 1986,
  "3A": 1996,
  "3B": 2026,
  "3C": 2057,
  "4A": 2099,
  "4B": 2151,
  "5A": 2233,
  "5B": 2315,
  "5C": 2398,
  "6A": 2533,
  "6B": 2688,
  "7A": 2667,
  "8A": 2874,
  "9A": 3287,
  "9B": 4145,
  "10A": 5023,
};

function setSituation(coefficient: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(coefficient === undefined ? {} : { [`${namespace} . position`]: `'${coefficient}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return Math.round((result as number) * 100) / 100;
}

function outOfGrid() {
  return engine.evaluate(`${namespace} . position hors grille`).nodeValue;
}

describe("IDCC 493 — 2026.2 minimum salaries (avenant n° 31)", () => {

  it("contains the 21 coefficients of the 2026 salary grid", () => {
    assert.equal(Object.keys(GRID).length, 21);
  });

  for (const [coefficient, expected] of Object.entries(GRID)) {
    it(`gives ${expected} € a month for coefficient ${coefficient}`, () => {
      setSituation(coefficient);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates the minimum once for part-time work", () => {
    setSituation("5A", "50%");
    assert.equal(minimum(), 1116.5);
  });

  it("rejects coefficients outside the grid", () => {
    for (const coefficient of ["0", "1D", "2D", "7B", "9C", "11A"]) {
      setSituation(coefficient);
      assert.equal(outOfGrid(), true, `${coefficient}`);
      assert.equal(minimum(), 0, `${coefficient}`);
    }
  });

  it("reports a missing coefficient as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("leaves the extension inapplicable for another agreement", () => {
    setSituation("5A");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . position hors grille`).nodeValue, null);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "1580-industrie-chaussure";
const value = "industrie chaussure";
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

// Accord du 16 juillet 2026, articles 2 and 3, from 1 June 2026.
const MONTHLY: Record<string, number> = {
  "1.1": 1867.02, "1.2": 1871,
  "2.1": 1881, "2.2": 1899, "2.3": 1922,
  "3.1": 1930, "3.2": 1946, "3.3": 1967,
};
const ANNUAL: Record<string, number> = {
  "4.1": 23617, "4.2": 24100, "4.3": 26103,
  "5.1": 26356, "5.2": 28244, "5.3": 30417,
  "6.1": 30712, "6.2": 34799,
  "P1.1": 32524, "P1.2": 34934, P2: 40275, P3: 46746, P4: 55378,
};

function setSituation(classification: string | undefined, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(classification === undefined ? {} : { [`${namespace} . classification`]: `'${classification}'` }),
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function minimum() {
  const result = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof result, "number");
  return result as number;
}

const outOfGrid = () => engine.evaluate(`${namespace} . classification hors grille`).nodeValue;

describe("IDCC 1580 — industrie de la chaussure, 2026.3", () => {
  it("is effective from 1 June 2026, extended on 13 October 2026, and cites the agreement", () => {
    assert.equal(version.validFrom, "2026-06-01");
    assert.equal(version.extension, "2026-10-13");
    assert.ok(version.sources.some((source: string) => source.includes("Accord du 16 juillet 2026")));
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000055057353")));
  });

  for (const [classification, expected] of Object.entries(MONTHLY)) {
    it(`${classification}: ${expected} € monthly minimum`, () => {
      setSituation(classification);
      assert.equal(minimum(), expected);
      assert.equal(outOfGrid(), false);
    });
  }

  for (const [classification, expected] of Object.entries(ANNUAL)) {
    it(`${classification}: ${expected} € annual minimum, one twelfth monthly`, () => {
      setSituation(classification);
      assert.ok(Math.abs(minimum() - expected / 12) < 1e-9);
      assert.equal(outOfGrid(), false);
    });
  }

  it("prorates monthly and annual minimums once for part-time work", () => {
    setSituation("2.2", "50%");
    assert.equal(minimum(), 1899 / 2);
    setSituation("P2", "80%");
    assert.equal(minimum(), (40275 / 12) * 0.8);
  });

  it("rejects classifications outside the published grid", () => {
    for (const classification of ["1", "1.3", "1.4", "3.4", "4", "6.3", "P1", "P5", "p1.1", "non renseigné"]) {
      setSituation(classification);
      assert.equal(outOfGrid(), true, classification);
      assert.equal(minimum(), 0, classification);
    }
  });

  it("reports a missing classification as outside the grid", () => {
    setSituation(undefined);
    assert.equal(outOfGrid(), true);
    assert.equal(minimum(), 0);
  });

  it("is inapplicable when another collective agreement is selected", () => {
    setSituation("2.2");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . classification hors grille`).nodeValue, null);
  });
});

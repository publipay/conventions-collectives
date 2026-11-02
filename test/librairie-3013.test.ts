import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3013-librairie";
const value = "librairie";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry: { version: string }) => entry.version === "2026.3");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setLevel(level: string) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${level}'`,
    "salarié . contrat . temps de travail . quotité": "100%",
  });
}

function minimum() {
  return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
}

describe("IDCC 3013 — 2026.3 salary minimums and payroll audit", () => {
  it("uses the official 1 April 2026 effective date", () => {
    assert.equal(version.validFrom, "2026-04-01");
    assert.ok(version.sources.some((source: string) => source.includes("KALITEXT000053926509")));
  });

  it("prorates the minimum once for part-time work", () => {
    setLevel("8");
    engine.setSituation({ "salarié . convention collective": `'${value}'`, [`${namespace} . niveau`]: "'8'", "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(minimum(), 1213);
  });

  it("marks an unknown level outside the grid", () => {
    setLevel("13");
    assert.equal(minimum(), 0);
  });

  it("is isolated from another convention", () => {
    setLevel("8");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });

  it("does not redefine payroll-wide endpoints or collide with modele-social", () => {
    assert.equal(Object.keys(extension).some((name) => name.includes("cotisations") || name.includes("prévoyance") || name.includes("santé") || name.includes("formation professionnelle") || name.includes("exonération cotisation AT")), false);
    assert.equal(Object.keys(extension).some((name) => name in modeleSocial), false);
  });
});

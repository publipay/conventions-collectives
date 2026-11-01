import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "carrières et matériaux de construction";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS["3249-carrieres-materiaux"]?.find((entry) => entry.version === "2026.4");
assert.ok(version);
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, await version.loadRules());
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function minimum(region: string, level: string, fib?: boolean) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . région`]: `'${region}'`,
    [`${namespace} . niveau et échelon`]: `'${level}'`,
    ...(fib === undefined ? {} : { [`${namespace} . préfabrication béton`]: fib ? "oui" : "non" }),
  });
  return engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
}

// Annexe 2 of the avenant n° 2 of 30 April 2026 (KALITEXT000055028570), harmonised grids at 1 July 2026.
describe("IDCC 3249, version 2026.4", () => {
  it("keeps the regional grid by default", () => {
    assert.equal(minimum("Auvergne-Rhône-Alpes", "3.3"), 2071);
    assert.equal(minimum("Île-de-France", "7.3", false), minimum("Île-de-France", "7.3"));
  });
  it("carries the harmonised grid of the precast concrete sector", () => {
    assert.equal(minimum("Auvergne-Rhône-Alpes", "1.1", true), 1876);
    assert.equal(minimum("Auvergne-Rhône-Alpes", "3.3", true), 2046);
    assert.equal(minimum("Centre-Val de Loire", "1.1", true), 1825);
    assert.equal(minimum("Île-de-France", "7.3", true), 3095);
    assert.equal(minimum("Sud PACA et Corse", "4.1", true), 2094);
    assert.equal(minimum("Normandie", "6.1", true), 2355);
    assert.equal(minimum("Normandie", "6.2", true), 2485);
  });
});

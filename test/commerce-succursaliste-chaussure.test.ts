import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0468-commerce-succursaliste-chaussure";
const value = "commerce succursaliste de la chaussure";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2025.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(classification: string, quota = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau et échelon`]: `'${classification}'`,
    "salarié . contrat . temps de travail . quotité": quota,
  });
}

function monthly() {
  return Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 100) / 100;
}

function annual() {
  return Math.round((engine.evaluate(`${namespace} . rémunération minimum annuelle conventionnelle`).nodeValue as number) * 100) / 100;
}

describe("IDCC 468 — 2025.2 minimum salaries and payroll isolation", () => {

  it("rejects unknown classifications and exposes the payroll audit", () => {
    setSituation("99");
    assert.equal(monthly(), 0);
    assert.equal(annual(), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true);
    assert.equal(engine.evaluate(`${namespace} . audit paie`).nodeValue, true);
  });

  it("keeps the namespace isolated from modele-social and other agreements", () => {
    for (const name of Object.keys(extension)) {
      assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
      assert.ok(!(name in modeleSocial), `Duplicate modele-social rule: ${name}`);
    }
    setSituation("5.2");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});

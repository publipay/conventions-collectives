import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "1043-gardiens-concierges-employes-immeubles";
const value = "gardiens concierges et employés d'immeubles";
const ns = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[id]?.find((entry: { version: string }) => entry.version === "2026.3");
assert.ok(version, "IDCC 1043 must be exported");
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(overrides: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${ns} . coefficient hiérarchique`]: 600,
    [`${ns} . heures contractuelles`]: "151.67 heures/mois",
    [`${ns} . unités de valeur`]: 10000,
    [`${ns} . catégorie`]: "'A'",
    [`${ns} . lots principaux`]: 20,
    [`${ns} . catégorie logement`]: "'1'",
    [`${ns} . surface logement`]: "60 m²",
    "salarié . contrat . temps de travail . quotité": "100%",
    ...overrides,
  });
}

const evaluate = (rule: string) => {
  const v = engine.evaluate(`${ns} . ${rule}`).nodeValue;
  return typeof v === "number" ? Math.round(v * 10000) / 10000 : v;
};

describe("IDCC 1043 — avenant n° 115", () => {

  it("blocks missing classification data and stays isolated from unrelated agreements", () => {
    setSituation({ [`${ns} . coefficient hiérarchique`]: 0 });
    assert.equal(evaluate("salaire minimum conventionnel"), null);
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue, null);
  });
});

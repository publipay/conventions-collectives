import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . sport";
const quiet = { logger: { log() {}, warn() {}, error() {} } };

// 2026.6 without redefining any modele-social rule.
for (const versionNumber of ["2026.6"] as const) {
  const version = COMPILED_VERSIONS["2511-sport"]?.find((v) => v.version === versionNumber);
  assert.ok(version);
  const extension = await version.loadRules();
  for (const name of Object.keys(extension)) assert.ok(!(name in modeleSocial), `Duplicate modele-social rule: ${name}`);
  const engine = new Engine({ ...modeleSocial, ...extension } as Record<string, Rule>, quiet);
  function value(rule: string) { return engine.evaluate(rule.startsWith("salarié .") ? rule : `${namespace} . ${rule}`).nodeValue; }

  describe(`IDCC 2511 Sport ${versionNumber}`, () => {
    it("leaves other conventions' core endpoints unchanged", () => {
      const baseline = new Engine(modeleSocial, quiet);
      const input = { "salarié . convention collective": "'autre'", "salarié . cotisations . assiette": "3000 €/mois", "entreprise . salariés . effectif": 5, "établissement . taux ATMP": "2%", "salarié . contrat . statut cadre": "non", "plafond sécurité sociale": "4000 €/mois" };
      engine.setSituation(input);
      baseline.setSituation(input);
      for (const rule of ["salarié . cotisations . ATMP", "salarié . cotisations . formation professionnelle", "salarié . cotisations . prévoyances . santé . montant", "salarié . cotisations . prévoyances . santé . salarié", "salarié . cotisations . prévoyances . conventionnelle . employeur"]) assert.equal(value(rule), baseline.evaluate(rule).nodeValue, rule);
    });
  });
}

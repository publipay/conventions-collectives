/**
 * IDCC 1351, revisions 2026.7 and 2026.8: the non-executives' provident contribution, 1,06 %
 * shared equally, is due « sur les tranches A et B », tranche B going from the monthly social
 * security ceiling to four times its amount (avenant du 10 juin 2002, article 2,
 * KALIARTI000047104169, read on Légifrance on 13 November 2026). Expected amounts use the ceiling
 * of 2026 (4 005 € a month, so 16 020 € for 4 ceilings), independently of the YAML.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const model = "1351-prevention-securite";
const value = "prévention et sécurité";
const namespace = `salarié . convention collective . ${value}`;

async function engineOf(versionName: string) {
  const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === versionName);
  assert.ok(version, versionName);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, await version.loadRules());
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

const cents = (value: unknown) => Math.round((value as number) * 100) / 100;

for (const [versionName, date] of [["2026.7", "01/03/2026"], ["2026.8", "01/10/2026"]] as const) {
  describe(`IDCC 1351 — ${versionName} non-executives' prévoyance within tranches A and B`, async () => {
    const engine = await engineOf(versionName);
    const share = (salary: number, name: "employeur" | "salarié") => {
      engine.setSituation({
        date,
        "salarié . convention collective": `'${value}'`,
        "salarié . contrat . statut cadre": "non",
        [`${namespace} . catégorie`]: "'exploitation'",
        [`${namespace} . coefficient`]: 120,
        "salarié . contrat . salaire brut": `${salary} €/mois`,
      });
      return cents(engine.evaluate(`salarié . cotisations . prévoyances . conventionnelle . ${name}`).nodeValue);
    };

    it("applies 0,53 % + 0,53 % below four ceilings", () => {
      assert.equal(share(3000, "employeur"), 15.9);
      assert.equal(share(3000, "salarié"), 15.9);
    });

    it("stops at four ceilings, 16 020 €", () => {
      assert.equal(share(20000, "employeur"), 84.91);
      assert.equal(share(20000, "salarié"), 84.91);
    });
  });
}

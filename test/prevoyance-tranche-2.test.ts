/**
 * Provident contributions on « T1 » and « T2 » of IDCC 1501 and 1909: tranche 2 is read as
 * Agirc-Arrco's, from 1 to 8 social security ceilings, the texts neither defining it nor setting
 * another limit (read on Légifrance on 13 November 2026).
 *
 * Expected amounts come from the texts, independently of the YAML, with the ceiling of 2026
 * (4 005 € a month, so 32 040 € for 8 ceilings):
 * - 1501, article 54 (avenant n° 10 du 5 décembre 2025, KALIARTI000054176836): 0,25 % for the
 *   employee and 0,25 % for the employer on T1 and on T2, for every employee; for an executive,
 *   the employer's 0,25 % of T1 is read as part of the 1,50 % of T1 of the ANI prévoyance, which
 *   the article recalls (versions 2026.10, 2026.11 and 2027.3);
 * - 1909, accord n° 41 du 30 août 2023 (KALITEXT000048558715): 0,86 % on both tranches for the
 *   non-executives, 1,74 % on tranche 1 and 2,87 % on tranche 2 for the executives, all paid by
 *   the employer.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

async function engineOf(agreement: string, versionName: string, value: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === versionName);
  assert.ok(version, `${agreement} ${versionName}`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, await version.loadRules());
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

const cents = (value: unknown) => Math.round((value as number) * 100) / 100;

describe("IDCC 1501 — prévoyance on tranche 2 up to 8 ceilings", () => {
  const namespace = "salarié . convention collective . restauration rapide";
  for (const [versionName, date] of [["2026.10", "01/03/2026"], ["2026.11", "01/10/2026"], ["2027.3", "01/01/2027"]] as const) {
    it(`applies 0,25 % + 0,25 % up to 32 040 € in ${versionName}`, async () => {
      const engine = await engineOf("1501-restauration-rapide", versionName, "restauration rapide");
      const share = (salary: number, name: "employeur" | "salarié", executive = false) => {
        engine.setSituation({
          date,
          "salarié . convention collective": "'restauration rapide'",
          "salarié . contrat . salaire brut": `${salary} €/mois`,
          "salarié . contrat . statut cadre": executive ? "oui" : "non",
        });
        return cents(engine.evaluate(`${namespace} . prévoyance . ${name}`).nodeValue);
      };
      const ceiling = cents(engine.evaluate("plafond sécurité sociale").nodeValue);
      // Between 4 and 8 ceilings, the whole salary: 20 000 € at 0,25 %.
      assert.equal(share(20000, "employeur"), 50);
      assert.equal(share(20000, "salarié"), 50);
      // Above 8 ceilings, nothing more.
      const capped = Math.round(8 * ceiling * 0.25) / 100;
      assert.equal(share(40000, "employeur"), capped);
      assert.equal(share(40000, "salarié"), capped);
      if (date.endsWith("2026")) assert.equal(capped, 80.1);
    });

    it(`applies it to the executives too in ${versionName}, the employer's T1 within the 1,50 %`, async () => {
      const engine = await engineOf("1501-restauration-rapide", versionName, "restauration rapide");
      engine.setSituation({
        date,
        "salarié . convention collective": "'restauration rapide'",
        "salarié . contrat . salaire brut": "20000 €/mois",
        "salarié . contrat . statut cadre": "oui",
      });
      const ceiling = engine.evaluate("plafond sécurité sociale").nodeValue as number;
      // The employee: 0,25 % of the whole 20 000 €; the employer: 0,25 % of tranche 2 only.
      assert.equal(cents(engine.evaluate(`${namespace} . prévoyance . salarié`).nodeValue), 50);
      const employer = cents(engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue);
      assert.equal(employer, Math.round((20000 - ceiling) * 0.25) / 100);
      // With the 1,50 % of T1 of the standard model.
      const total = cents(engine.evaluate("salarié . cotisations . prévoyances . incapacité invalidité décès . employeur").nodeValue);
      assert.equal(total, cents((20000 - ceiling) * 0.0025 + ceiling * 0.015));
      if (date.endsWith("2026")) {
        // 15 995 € at 0,25 % (39,9875 €) and 4 005 € at 1,50 % (60,075 €).
        assert.equal(employer, 39.99);
        assert.equal(total, 100.06);
      }
    });
  }
});

describe("IDCC 1909 — prévoyance on tranche 2 up to 8 ceilings (2026.5)", async () => {
  const namespace = "salarié . convention collective . organismes de tourisme";
  const engine = await engineOf("1909-organismes-tourisme", "2026.5", "organismes de tourisme");
  const employer = (salary: number, executive: boolean) => {
    engine.setSituation({
      "salarié . convention collective": "'organismes de tourisme'",
      [`${namespace} . niveau`]: "'3.3'",
      [`${namespace} . date de calcul`]: "11/10/2026",
      "salarié . contrat . salaire brut": `${salary} €/mois`,
      "salarié . contrat . statut cadre": executive ? "oui" : "non",
    });
    assert.equal(engine.evaluate(`${namespace} . prévoyance . salarié`).nodeValue, 0);
    return cents(engine.evaluate(`${namespace} . prévoyance . employeur`).nodeValue);
  };

  it("applies 0,86 % of the non-executives' salary up to 32 040 €", () => {
    assert.equal(employer(20000, false), 172);
    assert.equal(employer(40000, false), 275.54);
  });

  it("applies 1,74 % of tranche 1 and 2,87 % of tranche 2 for the executives", () => {
    // 4 005 € at 1,74 % (69,687 €) and 15 995 € at 2,87 % (459,0565 €).
    assert.equal(employer(20000, true), 528.74);
    // Above 8 ceilings: 28 035 € of tranche 2 (804,6045 €).
    assert.equal(employer(40000, true), 874.29);
  });
});

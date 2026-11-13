/**
 * Provident contributions of IDCC 843 (revision 2026.6) and 1922 (revision 2025.2), read on
 * Légifrance on 13 November 2026. Expected amounts come from the texts, independently of the YAML,
 * with the ceiling of 2026 (4 005 € a month):
 * - 843, avenant n° 130 du 15 novembre 2022 (KALITEXT000047211990): education annuity of 0,065 %
 *   of the salary within tranche A, called at 0,043 % for the employer and 0,022 % for a
 *   non-executive, all paid by the employer for an executive; not added to the payslip;
 * - 1922, accord du 17 décembre 2015, article 10 (KALIARTI000032241955): 0,88 % of tranche A, half
 *   each for a non-executive (its own examples: 2 500 € gives 11 € each), all paid by the employer
 *   for an executive and counted within the 1,50 % of tranche A that modele-social computes.
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

describe("IDCC 843 — education annuity split (2026.6)", async () => {
  const value = "boulangerie-pâtisserie artisanale";
  const namespace = `salarié . convention collective . ${value}`;
  const engine = await engineOf("0843-boulangerie-patisserie-artisanale", "2026.6", value);
  const evaluate = (rule: string, salary: number, executive: boolean) => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      [`${namespace} . niveau`]: executive ? "'C1'" : "'170'",
      "salarié . contrat . salaire brut": `${salary} €/mois`,
      "salarié . contrat . statut cadre": executive ? "oui" : "non",
    });
    return engine.evaluate(rule).nodeValue;
  };
  const annuity = (share: string, salary: number, executive: boolean) =>
    cents(evaluate(`${namespace} . prévoyance . rente éducation . ${share}`, salary, executive));

  it("calls 0,043 % from the employer and 0,022 % from a non-executive", () => {
    assert.equal(annuity("employeur", 2000, false), 0.86);
    assert.equal(annuity("salarié", 2000, false), 0.44);
  });

  it("keeps 0,065 % on the employer for an executive", () => {
    assert.equal(annuity("employeur", 2000, true), 1.3);
    assert.equal(annuity("salarié", 2000, true), 0);
  });

  it("stops at tranche A", () => {
    // 4 005 € at 0,043 % and 0,022 %.
    assert.equal(annuity("employeur", 6000, false), 1.72);
    assert.equal(annuity("salarié", 6000, false), 0.88);
  });

  it("is still not added to the payslip's contributions", () => {
    assert.equal(evaluate("salarié . cotisations . prévoyances . conventionnelle", 2000, false), 0);
  });
});

describe("IDCC 1922 — provident contribution on the payslip (2025.2)", async () => {
  const value = "radiodiffusion";
  const engine = await engineOf("1922-radiodiffusion", "2025.2", value);
  const contribution = (share: "employeur" | "salarié", salary: number, executive: boolean) => {
    engine.setSituation({
      date: "01/10/2026",
      "salarié . convention collective": `'${value}'`,
      "salarié . convention collective . radiodiffusion . indice": 200,
      "salarié . contrat . salaire brut": `${salary} €/mois`,
      "salarié . contrat . statut cadre": executive ? "oui" : "non",
    });
    return cents(engine.evaluate(`salarié . cotisations . prévoyances . conventionnelle . ${share}`).nodeValue);
  };

  it("takes 0,44 % from each for a non-executive, as in the text's examples", () => {
    assert.equal(contribution("employeur", 1800, false), 7.92);
    assert.equal(contribution("salarié", 1800, false), 7.92);
    assert.equal(contribution("employeur", 2500, false), 11);
    assert.equal(contribution("salarié", 2500, false), 11);
  });

  it("stops at tranche A", () => {
    // 4 005 € at 0,44 %.
    assert.equal(contribution("employeur", 6000, false), 17.62);
    assert.equal(contribution("salarié", 6000, false), 17.62);
  });

  it("adds nothing for an executive, within the 1,50 % of tranche A", () => {
    assert.equal(contribution("salarié", 6000, true), 0);
    const executive = engine.evaluate("salarié . cotisations . prévoyances . employeur . cadres").nodeValue;
    assert.equal(cents(executive), 60.08);
  });
});

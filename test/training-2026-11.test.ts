/**
 * Conventional vocational training contributions moved out of the legal contribution in November
 * 2026 (0086, 1411, 1486, 1518, 1607 and 3253): each revision keeps the previous version's total
 * and shows the conventional part as `formation professionnelle conventionnelle`, added to the
 * employer contributions. Amounts for a gross salary of 3 000 €/mois and 20 employees, for which the
 * legal contribution is 1 % (30 €).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

async function engineOf(model: string, value: string, revision: string) {
  const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === revision);
  assert.ok(version, `${model} ${revision}`);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  return (rule: string, context: Record<string, string | number> = {}) => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      "salarié . contrat . salaire brut": "3000 €/mois",
      "entreprise . salariés . effectif": 20,
      ...context,
    });
    const result = engine.evaluate(rule).nodeValue;
    return typeof result === "number" ? Math.round(result * 100) / 100 : result;
  };
}

const CASES: { model: string; value: string; previous: string; revision: string; amount: number }[] = [
  // 0.30 % of the base.
  { model: "0086-publicite", value: "publicité", previous: "2025.4", revision: "2025.5", amount: 9 },
  // 0.50 % from 10 employees.
  { model: "1411-fabrication-ameublement", value: "fabrication ameublement", previous: "2026.2", revision: "2026.3", amount: 15 },
  // 0.05 % below 50 employees.
  { model: "1486-syntec", value: "syntec", previous: "2026.6", revision: "2026.7", amount: 1.5 },
  // Global rate of 2.10 % less the legal 1 %.
  { model: "1518-eclat", value: "éclat", previous: "2026.3", revision: "2026.4", amount: 33 },
  // Global rate of 1.10 % (10 to 299 employees) less the legal 1 %.
  {
    model: "1607-jeux-jouets",
    value: "jeux jouets articles fêtes ornements noël puériculture voitures enfants modélisme",
    previous: "2026.4",
    revision: "2026.5",
    amount: 3,
  },
  // 0.35 % from 1 to 299 employees.
  {
    model: "3253-cabinets-avocats-salaries",
    value: "cabinets d'avocats salariés",
    previous: "2026.1",
    revision: "2026.2",
    amount: 10.5,
  },
];

for (const testCase of CASES) {
  describe(`${testCase.model} ${testCase.revision}, conventional training contribution`, async () => {
    const current = await engineOf(testCase.model, testCase.value, testCase.revision);
    const previous = await engineOf(testCase.model, testCase.value, testCase.previous);
    const training = `salarié . convention collective . ${testCase.value} . formation professionnelle conventionnelle`;

    it(`shows ${testCase.amount} € as its own rule`, () => {
      assert.equal(current(training), testCase.amount);
    });

    it("leaves the legal contribution alone", () => {
      assert.equal(current("salarié . cotisations . formation professionnelle"), 30);
    });

    it("keeps the employer contributions of the previous version", () => {
      assert.equal(current("salarié . cotisations . employeur"), previous("salarié . cotisations . employeur"));
      assert.equal(
        (current("salarié . cotisations . formation professionnelle") as number) + (current(training) as number),
        previous("salarié . cotisations . formation professionnelle"),
      );
    });

    it("does not apply to another agreement", () => {
      assert.equal(current(training, { "salarié . convention collective": "'droit commun'" }), null);
    });
  });
}

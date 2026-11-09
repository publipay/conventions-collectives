/**
 * Conventional vocational training contributions moved out of the legal contribution in November
 * 2026 (0086, 1411, 1486, 1518, 1607 and 3253): each revision keeps the previous version's total
 * and shows the conventional part as `formation professionnelle conventionnelle`, added to the
 * employer contributions. Then the contributions added to 1424, 1631, 2021, 2264, 897 and 1979.
 * Amounts for a gross salary of 3 000 €/mois and 20 employees, for which the legal contribution is
 * 1 % (30 €), on 1 July 2026 unless stated otherwise.
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
      date: "01/07/2026",
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

type AddedCase = {
  model: string;
  value: string;
  previous: string;
  revision: string;
  source: string;
  amount: number;
  others?: [Record<string, string | number>, number][];
};

const ADDED: AddedCase[] = [
  {
    model: "1424-reseaux-transports-publics-urbains",
    value: "réseaux de transports urbains",
    previous: "2025.2",
    revision: "2025.3",
    source: "KALITEXT000049620584",
    // 3 000 € × 0.3 %.
    amount: 9,
  },
  {
    model: "1424-reseaux-transports-publics-urbains",
    value: "réseaux de transports urbains",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000049620584",
    // 3 000 € × 0.3 %.
    amount: 9,
  },
  {
    model: "1631-hotellerie-plein-air",
    value: "hôtellerie de plein air",
    previous: "2025.2",
    revision: "2025.3",
    source: "KALITEXT000045847596",
    // 3 000 € × 0.18 %.
    amount: 5.4,
  },
  {
    model: "1631-hotellerie-plein-air",
    value: "hôtellerie de plein air",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000045847596",
    // 3 000 € × 0.18 %.
    amount: 5.4,
  },
  {
    model: "2021-golf",
    value: "golf",
    previous: "2026.3",
    revision: "2026.4",
    source: "KALITEXT000048638502",
    // 3 000 € × 0.25 %.
    amount: 7.5,
  },
  {
    model: "2264-hospitalisation-privee",
    value: "hospitalisation privée",
    previous: "2023.4",
    revision: "2023.5",
    source: "KALITEXT000052299667",
    // 3 000 € × 0.10 % from 2026.
    amount: 3,
    others: [[{ date: "01/12/2025" }, 0]],
  },
  {
    model: "0897-services-prevention-sante-travail-interentreprises",
    value: "services prévention santé travail interentreprises",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000052288844",
    // 3 000 € × 0.35 % in 2026 only.
    amount: 10.5,
    others: [[{ date: "01/01/2027" }, 0]],
  },
  {
    model: "1979-hotels-cafes-restaurants",
    value: "hôtels cafés restaurants",
    previous: "2024.5",
    revision: "2024.6",
    source: "KALITEXT000050394754",
    // 3 000 € × 0.2 % in 2026, 0.35 % in 2027, 0.5 % from 2028.
    amount: 6,
    others: [[{ date: "01/12/2025" }, 0], [{ date: "01/03/2027" }, 10.5], [{ date: "01/01/2028" }, 15]],
  },
  {
    model: "1979-hotels-cafes-restaurants",
    value: "hôtels cafés restaurants",
    previous: "2026.4",
    revision: "2026.5",
    source: "KALITEXT000050394754",
    // 3 000 € × 0.2 % in 2026, 0.35 % in 2027, 0.5 % from 2028.
    amount: 6,
    others: [[{ date: "01/12/2025" }, 0], [{ date: "01/03/2027" }, 10.5], [{ date: "01/01/2028" }, 15]],
  },
];

for (const testCase of ADDED) {
  describe(`${testCase.model} ${testCase.revision}, conventional training contribution added`, async () => {
    const current = await engineOf(testCase.model, testCase.value, testCase.revision);
    const previous = await engineOf(testCase.model, testCase.value, testCase.previous);
    const training = `salarié . convention collective . ${testCase.value} . formation professionnelle conventionnelle`;
    const version = COMPILED_VERSIONS[testCase.model]!.find((entry) => entry.version === testCase.revision)!;
    const before = COMPILED_VERSIONS[testCase.model]!.find((entry) => entry.version === testCase.previous)!;

    it("keeps the previous version's date and cites the text", () => {
      assert.equal(version.validFrom, before.validFrom);
      assert.ok(version.sources.some((source) => source.includes(testCase.source)));
    });

    it(`charges ${testCase.amount} € and adds it to the employer contributions`, () => {
      assert.equal(current(training), testCase.amount);
      const added = (current("salarié . cotisations . employeur") as number) - (previous("salarié . cotisations . employeur") as number);
      assert.equal(Math.round(added * 100) / 100, testCase.amount);
      assert.equal(current("salarié . cotisations . formation professionnelle"), 30);
    });

    for (const [context, expected] of testCase.others ?? []) {
      it(`gives ${expected} for ${JSON.stringify(context)}`, () => {
        assert.equal(current(training, context), expected);
      });
    }

    it("does not apply to another agreement", () => {
      assert.equal(current(training, { "salarié . convention collective": "'droit commun'" }), null);
    });
  });
}

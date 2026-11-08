/**
 * Joint bodies (paritarisme) contributions added in November 2026 to 538, 843, 959, 993, 1090,
 * 1147, 1286 and 1316, then 1405, 1505, 1518, 1619, 1996, 2021, 2264, 2332, 3203 and 3237. Amounts are computed from the texts cited in each version's sources, for
 * a gross salary of 3 000 €/mois unless stated otherwise (2026 ceiling: 4 005 €/mois).
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
  for (const name of Object.keys(extension)) assert.ok(!(name in rules), `Duplicate rule: ${name}`);
  Object.assign(rules, extension);
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  const evaluate = (rule: string, context: Record<string, string | number> = {}) => {
    engine.setSituation({
      "salarié . convention collective": `'${value}'`,
      "salarié . contrat . salaire brut": "3000 €/mois",
      "entreprise . salariés . effectif": 20,
      ...context,
    });
    const result = engine.evaluate(rule).nodeValue;
    return typeof result === "number" ? Math.round(result * 100) / 100 : result;
  };
  return { version, evaluate };
}

type Case = {
  model: string;
  value: string;
  previous: string;
  revision: string;
  source: string;
  /** Expected monthly amount for 3 000 € of gross salary and 20 employees. */
  amount: number;
  /** Other situations and their expected amount. */
  others?: [Record<string, string | number>, number | null][];
};

const CASES: Case[] = [
  {
    model: "0538-manutention-ferroviaire",
    value: "manutention ferroviaire",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000045111041",
    // 3 000 € × 0.0085 % = 0.255 €; not due by the companies of 1 to 10 employees.
    amount: 0.26,
    others: [[{ "entreprise . salariés . effectif": 10 }, null]],
  },
  {
    model: "0843-boulangerie-patisserie-artisanale",
    value: "boulangerie-pâtisserie artisanale",
    previous: "2026.4",
    revision: "2026.5",
    source: "KALITEXT000051664619",
    // 3 000 € × (0.15 % + 0.10 %).
    amount: 7.5,
  },
  {
    model: "0959-laboratoires-biologie-medicale",
    value: "laboratoires biologie médicale",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000038014422",
    // 3 000 € × 0.04 %; above the ceiling, 4 005 € × 0.04 % = 1.602 €.
    amount: 1.2,
    others: [[{ "salarié . contrat . salaire brut": "6000 €/mois" }, 1.6]],
  },
  {
    model: "0993-prothesistes-dentaires",
    value: "prothésistes dentaires",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000029954440",
    // 3 000 € × 0.15 %.
    amount: 4.5,
  },
  {
    model: "1090-services-automobile",
    value: "services automobile",
    previous: "2026.3",
    revision: "2026.4",
    source: "KALITEXT000005685156",
    // 3 000 € × 0.08 %; above four ceilings, 16 020 € × 0.08 % = 12.816 €; apprentices excluded.
    amount: 2.4,
    others: [
      [{ "salarié . contrat . salaire brut": "20000 €/mois" }, 12.82],
      [{ "salarié . contrat": "'apprentissage'" }, null],
    ],
  },
  {
    model: "1147-cabinets-medicaux",
    value: "cabinets médicaux",
    previous: "2024.2",
    revision: "2024.3",
    source: "KALITEXT000024983918",
    // 3 000 € × 0.02 %.
    amount: 0.6,
  },
  {
    model: "1286-confiserie-chocolaterie-biscuiterie-detaillants",
    value: "confiserie chocolaterie détaillants",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000051947464",
    // 3 000 € × 0.15 %, whatever the headcount.
    amount: 4.5,
    others: [[{ "entreprise . salariés . effectif": 1 }, 4.5]],
  },
  {
    model: "1316-tourisme-social-familial",
    value: "tourisme social et familial",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000005684557",
    // 3 000 € × 0.05 %.
    amount: 1.5,
  },  {
    model: "1405-expedition-exportation-fruits-legumes",
    value: "expédition exportation fruits légumes",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000049100265",
    // 3 000 € × 1 ‰.
    amount: 3,
  },
  {
    model: "1505-commerce-detail-alimentaire-non-specialise",
    value: "commerce de détail alimentaire non spécialisé",
    previous: "2026.8",
    revision: "2026.9",
    source: "KALITEXT000053049839",
    // 3 000 € × 0.15 %.
    amount: 4.5,
  },
  {
    model: "3237-commerce-detail-alimentaire-specialise",
    value: "commerce de détail alimentaire spécialisé",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000044085496",
    // 3 000 € × 0.15 %.
    amount: 4.5,
  },
  {
    model: "1518-eclat",
    value: "éclat",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000048052461",
    // 3 000 € × 0.1 %.
    amount: 3,
  },
  {
    model: "3203-structures-associatives-peche",
    value: "structures associatives de pêche de loisir et de protection du milieu aquatique",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000051447117",
    // 3 000 € × 0.10 %, the target rate from 2026.
    amount: 3,
  },
  {
    model: "1619-cabinets-dentaires",
    value: "cabinets dentaires",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000017579573",
    // 3 000 € × 0.05 %.
    amount: 1.5,
  },
  {
    model: "1996-pharmacie-officine",
    value: "pharmacie",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000005671176",
    // 3 000 € × 0.03 %.
    amount: 0.9,
  },
  {
    model: "2021-golf",
    value: "golf",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000021747679",
    // 3 000 € × 0.05 %.
    amount: 1.5,
  },
  {
    model: "2264-hospitalisation-privee",
    value: "hospitalisation privée",
    previous: "2023.3",
    revision: "2023.4",
    source: "KALITEXT000005660662",
    // 3 000 € × 0.007 %.
    amount: 0.21,
  },
  {
    model: "2332-entreprises-architecture",
    value: "entreprises d'architecture",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000048954007",
    // 3 000 € × 0.11 %.
    amount: 3.3,
  },
];

const employer = "salarié . cotisations . employeur";

for (const testCase of CASES) {
  describe(`${testCase.model} ${testCase.revision}, joint bodies contribution`, async () => {
    const current = await engineOf(testCase.model, testCase.value, testCase.revision);
    const previous = await engineOf(testCase.model, testCase.value, testCase.previous);
    const joint = `salarié . convention collective . ${testCase.value} . financement du paritarisme`;

    it("keeps the previous date and cites the text", () => {
      assert.equal(current.version.validFrom, previous.version.validFrom);
      assert.ok(current.version.sources.some((source) => source.includes(testCase.source)));
    });

    it(`charges ${testCase.amount} € for 3 000 € and adds it to the employer contributions`, () => {
      assert.equal(current.evaluate(joint), testCase.amount);
      const added = (current.evaluate(employer) as number) - (previous.evaluate(employer) as number);
      assert.equal(Math.round(added * 100) / 100, testCase.amount);
    });

    for (const [context, expected] of testCase.others ?? []) {
      it(`gives ${expected} for ${JSON.stringify(context)}`, () => {
        assert.equal(current.evaluate(joint, context), expected);
      });
    }

    it("does not apply to another agreement", () => {
      assert.equal(current.evaluate(joint, { "salarié . convention collective": "'droit commun'" }), null);
    });
  });
}

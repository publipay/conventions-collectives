/**
 * Conventional vocational training contributions moved out of the legal contribution in November
 * 2026 (0086, 1411, 1486, 1518, 1607 and 3253): each revision keeps the previous version's total
 * and shows the conventional part as `formation professionnelle conventionnelle`, added to the
 * employer contributions. Then the contributions added to 1424, 1631, 2021, 2264, 897 and 1979, then
 * 292, 1316, 1412, 2098, 2148, 3219 and 3250, then 1261, 1307, 3225, 1505, 3237, 2247, 2335 and 2596,
 * then 1875, 1909, 3013, 3016 and 3043, then 3232.
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
  /** The version without the contribution, when one is still published. */
  previous?: string;
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
  {
    model: "0292-plasturgie",
    value: "plasturgie",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000048150449",
    // 3 000 € × 0.15 % from 10 employees.
    amount: 4.5,
    others: [[{ "entreprise . salariés . effectif": 5 }, 0]],
  },
  {
    model: "1316-tourisme-social-familial",
    value: "tourisme social et familial",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000053721440",
    // 3 000 € × 0.40 % below 300 employees, until 2027.
    amount: 12,
    others: [[{ "entreprise . salariés . effectif": 300 }, 6], [{ date: "01/01/2028" }, 0]],
  },
  {
    model: "1412-installation-aeraulique-thermique-frigorifique",
    value: "installation aeraulique thermique frigorifique",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000052283480",
    // Below 11 employees only: 3 000 € × 0.1 %, from 2026 to 2030.
    amount: 0,
    others: [[{ "entreprise . salariés . effectif": 5 }, 3], [{ "entreprise . salariés . effectif": 5, date: "01/01/2031" }, 0]],
  },
  {
    model: "2098-prestataires-tertiaire",
    value: "prestataires tertiaires",
    previous: "2026.5",
    revision: "2026.6",
    source: "KALITEXT000054337542",
    // 3 000 € × 0.10 % from 11 to 49 employees, until 2026.
    amount: 3,
    others: [[{ "entreprise . salariés . effectif": 5 }, 6], [{ "entreprise . salariés . effectif": 60 }, 1.5], [{ date: "01/01/2027" }, 0]],
  },
  {
    model: "2148-telecommunications",
    value: "télécommunications",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000049150488",
    // 3 000 € × 0.05 % from 11 employees, until 2026.
    amount: 1.5,
    others: [[{ "entreprise . salariés . effectif": 5 }, 0.6], [{ date: "01/01/2027" }, 0]],
  },
  {
    model: "3219-portage-salarial",
    value: "portage salarial",
    previous: "2024.4",
    revision: "2024.5",
    source: "KALITEXT000043458326",
    // 3 000 € × 0.60 % from 11 employees.
    amount: 18,
    others: [[{ "entreprise . salariés . effectif": 5 }, 31.5]],
  },
  {
    model: "3250-commissaires-justice",
    value: "commissaires de justice et sociétés de ventes volontaires",
    previous: "2025.1",
    revision: "2025.2",
    source: "KALITEXT000049095645",
    // 3 000 € × 0.35 % from 11 employees.
    amount: 10.5,
    others: [[{ "entreprise . salariés . effectif": 5 }, 3.6]],
  },
  {
    model: "3250-commissaires-justice",
    value: "commissaires de justice et sociétés de ventes volontaires",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000049095645",
    // 3 000 € × 0.35 % from 11 employees.
    amount: 10.5,
    others: [[{ "entreprise . salariés . effectif": 5 }, 3.6]],
  },
  {
    model: "1261-acteurs-lien-social-familial",
    value: "acteurs du lien social et familial",
    previous: "2026.1",
    revision: "2026.12",
    source: "KALITEXT000042463667",
    // 3 000 € × 1.10 % from 11 employees.
    amount: 33,
    others: [[{ "entreprise . salariés . effectif": 5 }, 46.5]],
  },
  {
    model: "1261-acteurs-lien-social-familial",
    value: "acteurs du lien social et familial",
    previous: "2026.11",
    revision: "2026.13",
    source: "KALITEXT000042463667",
    // 3 000 € × 1.10 % from 11 employees.
    amount: 33,
    others: [[{ "entreprise . salariés . effectif": 5 }, 46.5]],
  },
  {
    model: "1307-exploitation-cinematographique",
    value: "exploitation cinématographique",
    previous: "2025.1",
    revision: "2025.2",
    source: "KALITEXT000049949410",
    // 3 000 € × 0.30 % from 11 employees.
    amount: 9,
    others: [[{ "entreprise . salariés . effectif": 5 }, 4.5]],
  },
  {
    model: "3225-editeurs-presse-magazine",
    value: "presse magazine",
    previous: "2024.1",
    revision: "2024.2",
    source: "KALITEXT000053721776",
    // 3 000 € × 0.1 % from 11 to 49 employees, 2026 to 2028.
    amount: 3,
    others: [[{ "entreprise . salariés . effectif": 60 }, 12], [{ "entreprise . salariés . effectif": 5 }, 0], [{ date: "01/12/2025" }, 0], [{ date: "01/01/2029" }, 0]],
  },
  {
    model: "1505-commerce-detail-alimentaire-non-specialise",
    value: "commerce de détail alimentaire non spécialisé",
    previous: "2026.9",
    revision: "2026.10",
    source: "KALITEXT000044065645",
    // 3 000 € × 0.60 % from 20 to 49 employees.
    amount: 18,
    others: [[{ "entreprise . salariés . effectif": 5 }, 4.5], [{ "entreprise . salariés . effectif": 60 }, 21]],
  },
  {
    model: "3237-commerce-detail-alimentaire-specialise",
    value: "commerce de détail alimentaire spécialisé",
    previous: "2026.1",
    revision: "2026.4",
    source: "KALITEXT000044065250",
    // 3 000 € × 0.60 % from 20 to 49 employees.
    amount: 18,
    others: [[{ "entreprise . salariés . effectif": 5 }, 4.5], [{ "entreprise . salariés . effectif": 60 }, 21]],
  },
  {
    model: "3237-commerce-detail-alimentaire-specialise",
    value: "commerce de détail alimentaire spécialisé",
    previous: "2026.3",
    revision: "2026.5",
    source: "KALITEXT000044065250",
    // 3 000 € × 0.60 % from 20 to 49 employees.
    amount: 18,
    others: [[{ "entreprise . salariés . effectif": 5 }, 4.5], [{ "entreprise . salariés . effectif": 60 }, 21]],
  },
  {
    model: "2247-courtage-assurances",
    value: "courtage assurances",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000049300720",
    // 3 000 € × 0.30 % from 11 employees, until 2026.
    amount: 9,
    others: [[{ "entreprise . salariés . effectif": 5 }, 13.5], [{ date: "01/01/2027" }, 0]],
  },
  {
    model: "2335-agences-generales-assurances",
    value: "agences générales assurances",
    previous: "2025.1",
    revision: "2025.2",
    source: "KALITEXT000052283649",
    // 3 000 € × 0.2 % from 11 employees.
    amount: 6,
    others: [[{ "entreprise . salariés . effectif": 5 }, 19.5]],
  },
  {
    model: "2335-agences-generales-assurances",
    value: "agences générales assurances",
    previous: "2026.1",
    revision: "2026.3",
    source: "KALITEXT000052283649",
    // 3 000 € × 0.2 % from 11 employees.
    amount: 6,
    others: [[{ "entreprise . salariés . effectif": 5 }, 19.5]],
  },
  {
    model: "2335-agences-generales-assurances",
    value: "agences générales assurances",
    previous: "2026.2",
    revision: "2026.4",
    source: "KALITEXT000052283649",
    // 3 000 € × 0.2 % from 11 employees.
    amount: 6,
    others: [[{ "entreprise . salariés . effectif": 5 }, 19.5]],
  },
  {
    model: "2596-coiffure",
    value: "coiffure",
    previous: "2026.3",
    revision: "2026.4",
    source: "KALITEXT000047331854",
    // 3 000 € × 0.60 % from 20 employees.
    amount: 18,
    others: [[{ "entreprise . salariés . effectif": 5 }, 12], [{ "entreprise . salariés . effectif": 15 }, 9]],
  },
  {
    model: "1875-cabinets-cliniques-veterinaires",
    value: "cabinets et cliniques vétérinaires",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000039479873",
    // 3 000 € × 0.60 % from 11 employees.
    amount: 18,
    others: [[{ "entreprise . salariés . effectif": 5 }, 13.5]],
  },
  {
    model: "1909-organismes-tourisme",
    value: "organismes de tourisme",
    revision: "2026.5",
    source: "KALITEXT000043793148",
    // 3 000 € × 0.40 % from 11 employees.
    amount: 12,
    others: [[{ "entreprise . salariés . effectif": 5 }, 13.5]],
  },
  {
    model: "3013-librairie",
    value: "librairie",
    previous: "2026.4",
    revision: "2026.5",
    source: "KALITEXT000032003321",
    // 3 000 € × 0.1 % from 10 to 299 employees.
    amount: 3,
    others: [[{ "entreprise . salariés . effectif": 5 }, 0], [{ "entreprise . salariés . effectif": 300 }, 0]],
  },
  {
    model: "3016-ateliers-chantiers-insertion",
    value: "ateliers et chantiers d'insertion",
    previous: "2026.3",
    revision: "2026.4",
    source: "KALITEXT000031496491",
    // 3 000 € × 0.60 %.
    amount: 18,
  },
  {
    model: "3043-entreprises-proprete",
    value: "propreté",
    previous: "2026.4",
    revision: "2026.5",
    source: "KALITEXT000051695012",
    // 3 000 € × 0.5 % from 11 employees.
    amount: 15,
    others: [[{ "entreprise . salariés . effectif": 5 }, 0]],
  },
  {
    model: "3232-agents-direction-securite-sociale",
    value: "agents de direction sécurité sociale",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000052531805",
    // 3 000 € × 0.15 % from 2026 to 2028.
    amount: 4.5,
    others: [[{ date: "01/12/2028" }, 4.5], [{ date: "01/01/2029" }, 0]],
  },
];

for (const testCase of ADDED) {
  describe(`${testCase.model} ${testCase.revision}, conventional training contribution added`, async () => {
    const current = await engineOf(testCase.model, testCase.value, testCase.revision);
    const previous = testCase.previous === undefined ? undefined : await engineOf(testCase.model, testCase.value, testCase.previous);
    const training = `salarié . convention collective . ${testCase.value} . formation professionnelle conventionnelle`;
    const version = COMPILED_VERSIONS[testCase.model]!.find((entry) => entry.version === testCase.revision)!;
    const before = COMPILED_VERSIONS[testCase.model]!.find((entry) => entry.version === testCase.previous);

    it("keeps the previous version's date and cites the text", () => {
      if (before) assert.equal(version.validFrom, before.validFrom);
      assert.ok(version.sources.some((source) => source.includes(testCase.source)));
    });

    it(`charges ${testCase.amount} € and adds it to the employer contributions`, () => {
      assert.equal(current(training), testCase.amount);
      const employer = "salarié . cotisations . employeur";
      const added = (current(employer) as number) - ((previous ? previous(employer) : current(employer, { [training]: 0 })) as number);
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

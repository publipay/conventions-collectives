/**
 * Joint bodies (paritarisme) contributions added in November 2026 to 538, 843, 959, 993, 1090,
 * 1147, 1286 and 1316, then 1405, 1505, 1518, 1619, 1996, 2021, 2264, 2332, 3203 and 3237, then 292, 1261, 1501, 1517, 1631, 1686, 1978, 2098, 3127
 * and 3213, then 1267, 1285, 1516, 1534, 1951, 2336, 2941, 3097, 3241 and 3242. Amounts are computed from the texts cited in each version's sources, for
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
  /** The version's own date, when it does not keep the previous one. */
  validFrom?: string;
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
  {
    model: "0292-plasturgie",
    value: "plasturgie",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000026484169",
    // 3 000 € × 0.05 %; the minimum and caps per establishment are not computed.
    amount: 1.5,
  },
  {
    model: "1261-acteurs-lien-social-familial",
    value: "acteurs du lien social et familial",
    previous: "2026.10",
    revision: "2026.11",
    source: "KALITEXT000005677524",
    // 3 000 € × 0.08 %.
    amount: 2.4,
  },
  {
    model: "1501-restauration-rapide",
    value: "restauration rapide",
    previous: "2026.6",
    revision: "2026.7",
    source: "KALITEXT000027195000",
    // 3 000 € × 0.012 %.
    amount: 0.36,
  },
  {
    model: "1501-restauration-rapide",
    value: "restauration rapide",
    previous: "2026.6",
    revision: "2027.1",
    source: "KALITEXT000055028206",
    validFrom: "2027-01-01",
    // 3 000 € × 0.01 %, from January 2027.
    amount: 0.3,
  },
  {
    model: "1517-commerce-detail-non-alimentaire",
    value: "commerce de détail non alimentaire",
    previous: "2026.3",
    revision: "2026.4",
    source: "KALITEXT000041439724",
    // 3 000 € × 0.07 %; the 50 € per establishment are not computed.
    amount: 2.1,
  },
  {
    model: "1631-hotellerie-plein-air",
    value: "hôtellerie de plein air",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000024629512",
    // 3 000 € × 0.03 %; the 25 € per SIRET are not computed.
    amount: 0.9,
  },
  {
    model: "1686-commerces-services-audiovisuel",
    value: "audiovisuel électronique équipement ménager",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000038201342",
    // 3 000 € × 0.02 %.
    amount: 0.6,
  },
  {
    model: "1978-fleuristes-animaux",
    value: "fleuristes animaux",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000054426672",
    // 3 000 € × 0.10 %; the 48 € are not computed.
    amount: 3,
  },
  {
    model: "2098-prestataires-tertiaire",
    value: "prestataires tertiaires",
    previous: "2026.4",
    revision: "2026.5",
    source: "KALITEXT000005680490",
    // 3 000 € × 0.03 %.
    amount: 0.9,
  },
  {
    model: "3127-services-personne",
    value: "services à la personne",
    previous: "2024.2",
    revision: "2024.3",
    source: "KALITEXT000022271536",
    // 3 000 € × 0.10 %.
    amount: 3,
  },
  {
    model: "3213-economistes-construction",
    value: "économistes de la construction et métreurs-vérificateurs",
    previous: "2026.2",
    revision: "2026.3",
    source: "KALITEXT000005654344",
    // 3 000 € × 0.06 %.
    amount: 1.8,
  },
  {
    model: "1267-patisserie",
    value: "pâtisserie",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000050792316",
    // 3 000 € × (0.20 % + 0.08 %).
    amount: 8.4,
  },
  {
    model: "1285-entreprises-artistiques-culturelles",
    value: "entreprises artistiques et culturelles",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000049150216",
    // 3 000 € × 0.25 %.
    amount: 7.5,
  },
  {
    model: "1516-organismes-formation",
    value: "organismes de formation",
    previous: "2025.1",
    revision: "2025.2",
    source: "KALITEXT000024891249",
    // 3 000 € × 0.05 %.
    amount: 1.5,
  },
  {
    model: "1516-organismes-formation",
    value: "organismes de formation",
    previous: "2027.1",
    revision: "2027.2",
    source: "KALITEXT000024891249",
    // 3 000 € × 0.05 %.
    amount: 1.5,
  },
  {
    model: "1534-industrie-commerces-gros-viandes",
    value: "industrie et commerces en gros des viandes",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000043925608",
    // 3 000 € × (0.1 % + 0.01 %).
    amount: 3.3,
  },
  {
    model: "1951-expertises-automobile",
    value: "expertises automobile",
    previous: "2025.1",
    revision: "2025.2",
    source: "KALITEXT000018084898",
    // 3 000 € × 0.008 % + 1 % × 4 005 € / 12 = 0.24 € + 3.3375 €.
    amount: 3.58,
  },
  {
    model: "2336-habitat-logement-accompagnes",
    value: "habitat logement accompagnés",
    previous: "2026.3",
    revision: "2026.4",
    source: "KALITEXT000037079586",
    // 3 000 € × 0.29 %.
    amount: 8.7,
  },
  {
    model: "2941-aide-soins-domicile",
    value: "aide et soins à domicile",
    previous: "2026.3",
    revision: "2026.4",
    source: "KALITEXT000033106206",
    // 3 000 € × 0.040 %.
    amount: 1.2,
  },
  {
    model: "3097-production-cinematographique",
    value: "production cinématographique",
    previous: "2026.1",
    revision: "2026.2",
    source: "KALITEXT000032426289",
    // 3 000 € × 0.045 %.
    amount: 1.35,
  },
  {
    model: "3241-telediffusion",
    value: "télédiffusion",
    previous: "2026.4",
    revision: "2026.5",
    source: "KALITEXT000047046214",
    // 3 000 € × 0.03 %.
    amount: 0.9,
  },
  {
    model: "3242-presse-regions",
    value: "presse en régions",
    previous: "2024.3",
    revision: "2024.4",
    source: "KALITEXT000051367412",
    // 3 000 € × 0.07 %.
    amount: 2.1,
  },
];

const employer = "salarié . cotisations . employeur";

for (const testCase of CASES) {
  describe(`${testCase.model} ${testCase.revision}, joint bodies contribution`, async () => {
    const current = await engineOf(testCase.model, testCase.value, testCase.revision);
    const previous = await engineOf(testCase.model, testCase.value, testCase.previous);
    const joint = `salarié . convention collective . ${testCase.value} . financement du paritarisme`;

    it("has the expected date and cites the text", () => {
      assert.equal(current.version.validFrom, testCase.validFrom ?? previous.version.validFrom);
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

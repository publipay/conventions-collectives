/**
 * The agreements' provident contributions computed on tranches read the contribution base without
 * the provident contributions and the social security ceiling prorated by working time and days
 * of employment, as modele-social's own capped contributions do. A payroll application that
 * regularises the tranches over the year (as Publipay does) sets these two values to the year's
 * cumulative amounts: the contribution must then follow them, whatever the gross salary of the
 * month. Texts read on Légifrance on 13 November 2026: no agreement sets a regularisation rule of
 * its own, several define the tranches on the annual ceiling (0573, 1147, 1505, 2511).
 *
 * Expected amounts are computed by hand from the rates of the texts, with a base of 30 000 € and a
 * ceiling of 10 000 € (tranche 1: 10 000 €, tranche 2 within 4 or 8 ceilings: 20 000 €; within
 * 3 ceilings for the building workers: 30 000 €), independently of the YAML.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const BASE = "salarié . cotisations . assiette . sans prévoyance";
const CEILING = "salarié . temps de travail . plafond sécurité sociale";
const CONVENTIONAL = "salarié . cotisations . prévoyances . conventionnelle";

type Case = {
  model: string;
  version: string;
  value: string;
  situation?: Record<string, string | number>;
  /** Rules of the employer and employee shares, by default modele-social's conventional ones. */
  rules?: { employer: string; employee: string };
  employer: number;
  employee: number;
};

const ns = (value: string) => `salarié . convention collective . ${value}`;
const nonExecutive = { "salarié . contrat . statut cadre": "non" };
const executive = { "salarié . contrat . statut cadre": "oui" };

const CASES: Case[] = [
  // 0,62 % within 4 ceilings, 60 % employer, 40 % employee.
  { model: "0573-commerces-de-gros", version: "2026.4", value: "commerces de gros", situation: nonExecutive, employer: 111.6, employee: 74.4 },
  // Rente éducation, tranche A: 0,043 % and 0,022 %.
  {
    model: "0843-boulangerie-patisserie-artisanale", version: "2026.6", value: "boulangerie-pâtisserie artisanale", situation: nonExecutive,
    rules: {
      employer: `${ns("boulangerie-pâtisserie artisanale")} . prévoyance . rente éducation . employeur`,
      employee: `${ns("boulangerie-pâtisserie artisanale")} . prévoyance . rente éducation . salarié`,
    },
    employer: 4.3, employee: 2.2,
  },
  // 1,54 % and 1,02 % within 4 ceilings.
  {
    model: "1147-cabinets-medicaux", version: "2024.3", value: "cabinets médicaux", situation: nonExecutive,
    rules: { employer: `${ns("cabinets médicaux")} . prévoyance . employeur`, employee: `${ns("cabinets médicaux")} . prévoyance . salarié` },
    employer: 462, employee: 306,
  },
  // 0,53 % each within 4 ceilings.
  { model: "1351-prevention-securite", version: "2026.8", value: "prévention et sécurité", situation: nonExecutive, employer: 159, employee: 159 },
  // Executives: 1,54 % of tranche A for the employer, 0,52 % each on tranche B.
  { model: "1351-prevention-securite", version: "2026.8", value: "prévention et sécurité", situation: executive, employer: 258, employee: 104 },
  // 0,336 % and 0,224 % within 4 ceilings.
  { model: "1431-optique-lunetterie-detail", version: "2026.1", value: "optique-lunetterie de détail", situation: nonExecutive, employer: 100.8, employee: 67.2 },
  // 0,25 % each on T1 and T2 (within 8 ceilings).
  { model: "1501-restauration-rapide", version: "2027.3", value: "restauration rapide", situation: nonExecutive, employer: 75, employee: 75 },
  // 1,03 % and 0,33 % within 4 ceilings.
  {
    model: "1505-commerce-detail-alimentaire-non-specialise", version: "2026.10", value: "commerce de détail alimentaire non spécialisé",
    situation: nonExecutive, employer: 309, employee: 99,
  },
  // 0,745 % each on T1, 1,125 % each on T2.
  { model: "1512-promotion-immobiliere", version: "2026.6", value: "promotion immobilière", situation: nonExecutive, employer: 299.5, employee: 299.5 },
  // 0,52 % each within 4 ceilings (one scheme for 1543 and 1586).
  { model: "1543-boyauderie", version: "2026.1", value: "boyauderie", situation: nonExecutive, employer: 156, employee: 156 },
  { model: "1586-industries-charcutieres", version: "2026.2", value: "industries charcutières", situation: nonExecutive, employer: 156, employee: 156 },
  // Executives: 1,74 % on T1 and 2,87 % on T2, employer only.
  { model: "1909-organismes-tourisme", version: "2026.5", value: "organismes de tourisme", situation: executive, employer: 748, employee: 0 },
  // 0,44 % each of tranche A.
  { model: "1922-radiodiffusion", version: "2025.2", value: "radiodiffusion", situation: nonExecutive, employer: 44, employee: 44 },
  // 0,43 % each of tranche A.
  { model: "1979-hotels-cafes-restaurants", version: "2026.6", value: "hôtels cafés restaurants", situation: nonExecutive, employer: 43, employee: 43 },
  // 0,485 % each within 4 ceilings.
  { model: "2511-sport", version: "2026.6", value: "branche du sport", situation: nonExecutive, employer: 145.5, employee: 145.5 },
  // 1,20 % of tranche A, employer only, after a year in the branch.
  {
    model: "3090-spectacle-vivant-prive", version: "2025.4", value: "spectacle vivant privé",
    situation: { ...nonExecutive, [`${ns("spectacle vivant privé")} . ancienneté dans la branche`]: "2 an" },
    employer: 120, employee: 0,
  },
  // Building executives (RNPC): 1,50 % of tranche A for the employer, 2,40 % of tranche B shared.
  {
    model: "2420-batiment-cadres", version: "2026.8", value: "bâtiment et travaux publics",
    situation: { [`${ns("bâtiment et travaux publics")} . catégorie`]: "'cadre'" },
    employer: 390, employee: 240,
  },
  {
    model: "3212-travaux-publics-cadres", version: "2026.7", value: "bâtiment et travaux publics",
    situation: { [`${ns("bâtiment et travaux publics")} . catégorie`]: "'cadre'" },
    employer: 390, employee: 240,
  },
];

async function engineOf(model: string, versionName: string, value: string) {
  const version = COMPILED_VERSIONS[model]?.find((entry) => entry.version === versionName);
  assert.ok(version, `${model} ${versionName}`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, await version.loadRules());
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

const cents = (value: unknown) => Math.round((value as number) * 100) / 100;
const date = (iso: string) => iso.split("-").reverse().join("/");

describe("agreements' provident tranches on the regularised base and ceiling", () => {
  for (const c of CASES) {
    const label = `${c.model} ${c.version}${c.situation?.["salarié . contrat . statut cadre"] === "oui" ? " (executive)" : ""}`;
    it(`${label}: follows the base and the ceiling it is given`, async () => {
      const { version, engine } = await engineOf(c.model, c.version, c.value);
      engine.setSituation({
        date: date(version.validFrom),
        "salarié . convention collective": `'${c.value}'`,
        "salarié . contrat . salaire brut": "2500 €/mois",
        ...c.situation,
        [BASE]: "30000 €/mois",
        [CEILING]: "10000 €/mois",
      });
      const rules = c.rules ?? { employer: `${CONVENTIONAL} . employeur`, employee: `${CONVENTIONAL} . salarié` };
      assert.equal(cents(engine.evaluate(rules.employer).nodeValue), c.employer, "employer");
      assert.equal(cents(engine.evaluate(rules.employee).nodeValue), c.employee, "employee");
    });
  }
});

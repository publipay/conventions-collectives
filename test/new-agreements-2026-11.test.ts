import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

// Amounts read in the legal texts on Légifrance (November 2026), independently of the rules.
type Case = {
  agreement: string;
  version: string;
  value: string;
  input: string;
  annual?: boolean;
  amounts: [string | number, number, number?][]; // classification, full-time minimum, seniority years
  outOfGrid: string | number;
};

const hourly = (rate: number) => Math.round(rate * 151.67 * 100) / 100;

const cases: Case[] = [
  {
    agreement: "0303-couture-parisienne", version: "2024.1", value: "couture parisienne", input: "niveau", annual: true,
    amounts: [["1.A", 21801], ["3.B", 27755], ["6.C", 49780], ["7.B", 50275], ["9.C", 74593]], outOfGrid: "7.A",
  },
  {
    agreement: "0538-manutention-ferroviaire", version: "2026.2", value: "manutention ferroviaire", input: "classification",
    amounts: [["ouvrier 156", hourly(12.14)], ["ouvrier 196", hourly(13.34)], ["employé niveau 4", 1932.39], ["chef de chantier", 2666.41, 0], ["chef de chantier", 2826.4, 4], ["contremaître", 2657.51, 20]],
    outOfGrid: "ouvrier 197",
  },
  {
    agreement: "0614-serigraphie", version: "2023.1", value: "sérigraphie", input: "position",
    amounts: [["A", 1747.2], ["E", 2196.71], ["I", 3769.87]], outOfGrid: "J",
  },
  {
    agreement: "0637-industries-commerce-recuperation", version: "2026.2", value: "récupération", input: "niveau",
    amounts: [["I.A", 1910.42], ["IV.B", 2177.47], ["VII.C", 3815.02]], outOfGrid: "VII.D",
  },
  {
    agreement: "0953-charcuterie-detail", version: "2026.2", value: "charcuterie de détail", input: "coefficient",
    amounts: [[150, hourly(12.27)], [200, hourly(13.94)], [330, hourly(20.43)]], outOfGrid: 250,
  },
  {
    agreement: "0998-exploitation-equipements-thermiques", version: "2025.1", value: "exploitation équipements thermiques", input: "niveau", annual: true,
    amounts: [["1", 22448], ["5", 26801], ["9", 37710]], outOfGrid: "10",
  },
  {
    agreement: "1256-cadres-exploitation-equipements-thermiques", version: "2025.1", value: "cadres exploitation équipements thermiques", input: "coefficient", annual: true,
    amounts: [[65, 36337], [90, 50313], [180, 100626]], outOfGrid: 64,
  },
  {
    agreement: "1285-entreprises-artistiques-culturelles", version: "2026.2", value: "entreprises artistiques et culturelles", input: "groupe et échelon",
    amounts: [["1.1", 3513.35], ["5.3", 2159.48], ["9.12", 2485.33]], outOfGrid: "10.1",
  },
  {
    agreement: "1794-institutions-retraite-complementaire", version: "2025.1", value: "institutions de retraite complémentaire", input: "classe",
    amounts: [["1A", 1803], ["4B", 2151], ["8D", 5551]], outOfGrid: "7A",
  },
  {
    agreement: "2691-enseignement-prive-independant", version: "2026.2", value: "enseignement privé indépendant", input: "catégorie et échelon", annual: true,
    amounts: [["E1.A", 22986.11], ["T2.B", 27454.97], ["C3.C", 55468.09], ["enseignant 1.A", 25284.68], ["enseignant 10.C", 38951.94]], outOfGrid: "enseignant 11.A",
  },
  {
    agreement: "3168-professions-photographie", version: "2024.2", value: "photographie", input: "coefficient",
    amounts: [[150, 1767], [250, 2521], [450, 4393]], outOfGrid: 160,
  },
  {
    agreement: "3210-banque-populaire", version: "2024.1", value: "banque populaire", input: "niveau", annual: true,
    amounts: [["A", 21976, 0], ["A", 24264, 25], ["F", 29189, 22], ["K", 60799, 12]], outOfGrid: "L",
  },
];

for (const testCase of cases) {
  describe(`${testCase.agreement} ${testCase.version}`, async () => {
    const version = COMPILED_VERSIONS[testCase.agreement]?.find((entry) => entry.version === testCase.version);
    assert.ok(version, testCase.agreement);
    const ns = `salarié . convention collective . ${testCase.value}`;
    const rules: Record<string, Rule> = { ...modeleSocial };
    const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
    rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], testCase.value] } as Rule;
    const extension = await version.loadRules();
    for (const name of Object.keys(extension)) {
      assert.ok(name === ns || name.startsWith(`${ns} . `), name);
      assert.ok(!(name in modeleSocial), `Duplicate modele-social rule: ${name}`);
    }
    Object.assign(rules, extension);
    const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
    const minimumRule = `${ns} . ${testCase.annual ? "salaire minimum annuel conventionnel" : "salaire minimum conventionnel"}`;

    function evaluate(classification: string | number, quota = "100%", seniority?: number) {
      engine.setSituation({
        "salarié . convention collective": `'${testCase.value}'`,
        [`${ns} . ${testCase.input}`]: typeof classification === "number" ? classification : `'${classification}'`,
        "salarié . contrat . temps de travail . quotité": quota,
        ...(seniority === undefined ? {} : { [`${ns} . ancienneté`]: seniority }),
      });
      return engine.evaluate(minimumRule).nodeValue as number;
    }

    it("gives the minimum of each sampled classification", () => {
      for (const [classification, amount, seniority] of testCase.amounts) {
        assert.equal(Math.round(evaluate(classification, "100%", seniority) * 100) / 100, amount, String(classification));
      }
    });

    it("prorates once for part-time and flags a classification out of the grid", () => {
      const [classification, amount, seniority] = testCase.amounts[0]!;
      assert.equal(Math.round(evaluate(classification, "50%", seniority) * 100) / 100, Math.round(amount * 50) / 100);
      evaluate(testCase.outOfGrid);
      assert.equal(engine.evaluate(`${ns} . ${testCase.input} hors grille`).nodeValue, true);
    });
  });
}

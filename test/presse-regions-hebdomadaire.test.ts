/**
 * IDCC 3242, versions 2023.5 and 2024.4: the grid of the regional daily press (accord of 30 June
 * 2023, KALITEXT000048558839) and the one of the regional weekly press, chosen by `forme de
 * presse`: accord of 2 June 2023 (KALITEXT000048052775), then, for the employees, avenant n° 1
 * of 15 November 2024 (KALITEXT000051352524, not extended), with its seniority increase; and the
 * regional departmental daily press, whose grid is in annex 3 of the agreement
 * (KALISCTA000044340086).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "3242-presse-regions";
const value = "presse en régions";
const namespace = `salarié . convention collective . ${value}`;
const WEEKLY = "hebdomadaire régionale";

async function engineOf(versionName: string) {
  const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === versionName);
  assert.ok(version, versionName);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], value],
  } as Rule;
  Object.assign(rules, await version.loadRules());
  return { version, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

function evaluate(
  engine: Engine,
  level: string | undefined,
  options: { form?: string; seniority?: number; quota?: string } = {},
) {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    ...(level === undefined ? {} : { [`${namespace} . niveau`]: `'${level}'` }),
    ...(options.form === undefined ? {} : { [`${namespace} . forme de presse`]: `'${options.form}'` }),
    ...(options.seniority === undefined ? {} : { [`${namespace} . ancienneté dans l'entreprise`]: `${options.seniority} an` }),
    ...(options.quota === undefined ? {} : { "salarié . contrat . temps de travail . quotité": options.quota }),
  });
  const amount = engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue;
  assert.equal(typeof amount, "number");
  return {
    amount: Math.round((amount as number) * 100) / 100,
    outOfGrid: engine.evaluate(`${namespace} . niveau hors grille`).nodeValue,
  };
}

/**
 * Accord of 2 June 2023, regional weekly press: the employees' coefficients 400 to 428 have the
 * SMPG of 1 834,60 € (note [1]) instead of 1 747,20 € (400 to 421) and 1 774,06 € (428).
 */
const WEEKLY_EMPLOYEES_2023: Record<string, number> = {
  "400": 1834.6, "407": 1834.6, "414": 1834.6, "421": 1834.6, "428": 1834.6, "435": 1803.08,
  "447": 1852.82, "462": 1914.99, "480": 1989.6, "500": 2072.5, "520": 2155.4,
};
const WEEKLY_EXECUTIVES: Record<string, number> = { "158": 2148.64, "170": 2311.83, "190": 2583.81, "210": 2855.79 };

/** Avenant n° 1 of 15 November 2024: groups of the employees, before the seniority increase. */
const WEEKLY_EMPLOYEES_2024: Record<string, number> = { G1: 1900, G2: 1940, G3: 1980, G4: 2020, G5: 2100, G6: 2250 };
const DEPARTMENTAL_FORM = "quotidienne départementale";

/** The seniority bonus of the version, in euros a month. */
function bonus(engine: Engine, level: string, form: string, seniority: number, quota?: string) {
  evaluate(engine, level, { form, seniority, ...(quota === undefined ? {} : { quota }) });
  const amount = engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue;
  assert.equal(typeof amount, "number");
  return amount as number;
}

for (const versionName of ["2023.5", "2024.4"] as const) {
  describe(`IDCC 3242 — ${versionName}, seniority bonus of the departmental daily press`, async () => {
    const { engine } = await engineOf(versionName);

    it("pays the employees 3 % of their minimum after 3 years, up to 18 % after 18 years", () => {
      // Coefficient 160: 1 657,54 €.
      for (const [seniority, rate] of [[2, 0], [3, 3], [8, 6], [9, 9], [12, 12], [15, 15], [18, 18], [30, 18]] as const) {
        assert.equal(bonus(engine, "160", DEPARTMENTAL_FORM, seniority), Math.round(1657.54 * rate) / 100, `${seniority} years`);
      }
    });

    it("pays the administrative executives up to 20 % after 20 years", () => {
      // Cadre supérieur B: 2 852,98 €.
      assert.equal(bonus(engine, "cadre supérieur B", DEPARTMENTAL_FORM, 19), Math.round(2852.98 * 18) / 100);
      assert.equal(bonus(engine, "cadre supérieur B", DEPARTMENTAL_FORM, 20), Math.round(2852.98 * 20) / 100);
    });

    it("pays no bonus to the workers, the groups I to IV and the daily press", () => {
      for (const [level, form] of [["O", DEPARTMENTAL_FORM], ["C4.2", DEPARTMENTAL_FORM], ["E6", "quotidienne régionale"], ["C4.2", "quotidienne régionale"]]) {
        assert.equal(bonus(engine, level!, form!, 25), 0, level);
      }
    });

    it("prorates the bonus with the minimum for part-time work", () => {
      assert.equal(bonus(engine, "160", DEPARTMENTAL_FORM, 18, "50%"), Math.round(828.77 * 18) / 100);
    });
  });
}

describe("IDCC 3242 — 2024.4, seniority bonus of the weekly press employees", async () => {
  const { engine } = await engineOf("2024.4");

  it("no longer increases the minimum with the seniority", () => {
    for (const [group, monthly] of Object.entries(WEEKLY_EMPLOYEES_2024)) {
      assert.deepEqual(evaluate(engine, group, { form: WEEKLY, seniority: 12 }), { amount: monthly, outOfGrid: false }, group);
    }
  });

  it("pays 5 % of the group's minimum after 5 years and 10 % after 10 years", () => {
    for (const [group, monthly] of Object.entries(WEEKLY_EMPLOYEES_2024)) {
      assert.equal(bonus(engine, group, WEEKLY, 4), 0, group);
      assert.equal(bonus(engine, group, WEEKLY, 5), Math.round(monthly * 5) / 100, group);
      assert.equal(bonus(engine, group, WEEKLY, 10), Math.round(monthly * 10) / 100, group);
    }
    for (const level of Object.keys(WEEKLY_EXECUTIVES)) assert.equal(bonus(engine, level, WEEKLY, 12), 0, level);
  });
});

describe("IDCC 3242 — 2023.5, no bonus for the weekly press employees of 2023", async () => {
  const { engine } = await engineOf("2023.5");
  it("pays no bonus on the coefficients of the accord of 2 June 2023", () => {
    for (const level of [...Object.keys(WEEKLY_EMPLOYEES_2023), ...Object.keys(WEEKLY_EXECUTIVES)]) {
      assert.equal(bonus(engine, level, WEEKLY, 12), 0, level);
    }
  });
});

/**
 * Revisions that give the seniority bonus apart from the minimum, so that it is paid in addition to
 * the base salary:
 * - IDCC 1483, 2026.3: avenant n° 29 (KALITEXT000053914115), article 2, a fixed amount
 *   by category and seniority, prorated by working time, no longer in the minimum;
 * - IDCC 3127, 2024.3: avenant of 29 March 2022 (KALITEXT000046100203), 0,05 €, 0,15 € or 0,25 €
 *   per hour of work after 2, 5 or 10 years.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

async function engineOf(agreement: string, value: string, version: string) {
  const found = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === version);
  assert.ok(found, `${agreement} ${version}`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], value])],
  } as Rule;
  Object.assign(rules, await found.loadRules());
  return { found, engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }) };
}

const round = (value: unknown) => {
  assert.equal(typeof value, "number");
  return Math.round((value as number) * 100) / 100;
};

describe("IDCC 1483 — seniority bonus apart from the minimum", async () => {
  const namespace = "salarié . convention collective . commerce de détail habillement";
  for (const version of ["2026.3"]) {
    const { found, engine } = await engineOf("1483-commerce-detail-habillement-textiles", "commerce de détail habillement", version);
    const evaluate = (level: string, hireDate: string, extra: Record<string, string> = {}) => {
      engine.setSituation({
        date: "01/10/2026",
        "salarié . convention collective": "'commerce de détail habillement'",
        "salarié . contrat . date d'embauche": hireDate,
        [`${namespace} . niveau`]: `'${level}'`,
        ...extra,
      });
      return {
        minimum: round(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue),
        bonus: round(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue),
      };
    };

    it(`${version}: cites the avenant n° 29 on Légifrance`, () => {
      assert.ok(found.sources.some((source) => source.includes("KALITEXT000053914115")));
    });

    it(`${version}: gives the bonus of the employees and supervisors A1 and A2 apart from their minimum`, () => {
      // Category 3 after 9 years: 1 843 € and 65 €; A2 after 18 years: 2 262 € and 115 €.
      assert.deepEqual(evaluate("3", "01/01/2017"), { minimum: 1843, bonus: 65 });
      assert.deepEqual(evaluate("A2", "01/01/2008"), { minimum: 2262, bonus: 115 });
      assert.deepEqual(evaluate("8", "01/01/2025"), { minimum: 2043, bonus: 0 });
    });

    it(`${version}: gives no bonus to the categories B, C and D, whose minimum rises with seniority`, () => {
      // Category B after 6 years: 2 644 €.
      assert.deepEqual(evaluate("B", "01/01/2020"), { minimum: 2644, bonus: 0 });
    });

    it(`${version}: prorates the bonus by working time`, () => {
      const halfTime = {
        "salarié . contrat . temps de travail . temps partiel": "oui",
        "salarié . contrat . temps de travail . temps partiel . heures par semaine": "17.5 heure/semaine",
      };
      assert.deepEqual(evaluate("3", "01/01/2017", halfTime), { minimum: 921.5, bonus: 32.5 });
    });
  }
});

describe("IDCC 3127 — 2024.3, hourly bonus on the hours of the month", async () => {
  const namespace = "salarié . convention collective . services à la personne";
  const { engine } = await engineOf("3127-services-personne", "services à la personne", "2024.3");
  const bonus = (years: number, extra: Record<string, string> = {}) => {
    engine.setSituation({
      date: "01/10/2026",
      "salarié . convention collective": "'services à la personne'",
      [`${namespace} . emploi-repère`]: "'jardinage'",
      [`${namespace} . ancienneté`]: `${years} an`,
      ...extra,
    });
    return round(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue);
  };

  it("pays 0,05 €, 0,15 € and 0,25 € per hour after 2, 5 and 10 years", () => {
    assert.equal(bonus(1), 0);
    assert.equal(bonus(2), round(0.05 * 151.67));
    assert.equal(bonus(5), round(0.15 * 151.67));
    assert.equal(bonus(10), round(0.25 * 151.67));
  });

  it("counts the hours of a part-time contract and the overtime", () => {
    const partTime = {
      "salarié . contrat . temps de travail . temps partiel": "oui",
      "salarié . contrat . temps de travail . temps partiel . heures par semaine": "17.5 heure/semaine",
    };
    assert.equal(bonus(10, partTime), round(0.25 * (151.67 / 2)));
    assert.equal(bonus(10, { "salarié . temps de travail . heures supplémentaires": "10 heure/mois" }), round(0.25 * 161.67));
  });
});

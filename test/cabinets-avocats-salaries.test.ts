import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "3253-cabinets-avocats-salaries";
const ns = "salarié . convention collective . cabinets d'avocats salariés";

async function makeEngine(revision = "2025.1") {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === revision);
  assert.ok(version, "IDCC 3253 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "cabinets d'avocats salariés"],
  } as Rule;
  for (const name of Object.keys(extension)) {
    assert.equal(name in rules, false, `Unexpected modele-social collision: ${name}`);
  }
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function set(engine: Engine, values: Record<string, string | number> = {}) {
  engine.setSituation({
    "salarié . convention collective": "'cabinets d'avocats salariés'",
    [`${ns} . coefficient`]: 300,
    [`${ns} . date de calcul`]: "01/10/2025",
    "salarié . contrat . statut cadre": "non",
    ...values,
  });
}

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

describe("IDCC 3253 — salariés des cabinets d'avocats", () => {
  it("applies the sourced monthly minimum and prorates once", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . coefficient`]: 300, "salarié . contrat . temps de travail . quotité": "50%" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1195);
  });

  it("keeps the thirteenth-month annual guarantee in €/an", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . coefficient`]: 300 });
    assert.equal(get(engine, "salaire minimum annuel conventionnel").nodeValue, 31070);
  });

  it("rejects dates before the extended convention takes effect", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . date de calcul`]: "30/09/2025" });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
  });

  it("reports an unknown coefficient instead of inventing a minimum", async () => {
    const engine = await makeEngine();
    set(engine, { [`${ns} . coefficient`]: 999 });
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
    assert.equal(get(engine, "coefficient hors grille").nodeValue, true);
  });

  it("keeps the contribution namespace inherited and isolated", async () => {
    const engine = await makeEngine();
    set(engine);
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2390);
    assert.equal(Object.keys(engine.getParsedRules()).some((name) => name.includes("cabinets d'avocats'")), false);
  });
});

// Revision 2025.2: articles 3 and 4 of the accord of 14 April 2023 (KALIARTI000047865925,
// KALIARTI000047865926), 0.06 % of the gross salaries capped at the social security ceiling.
describe("IDCC 3253 — 2025.2, joint bodies contribution", () => {
  const joint = "financement du paritarisme";
  const employer = (engine: Engine) => engine.evaluate("salarié . cotisations . employeur").nodeValue as number;

  it("cites the accord and keeps the 2025.1 date", () => {
    const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2025.2");
    assert.equal(version?.validFrom, "2025-10-01");
    assert.ok(version?.sources.some((source) => source.includes("KALITEXT000047865919")));
  });

  it("charges 0.06 % of the gross salary, capped at the ceiling, and adds it to the employer contributions", async () => {
    const engine = await makeEngine("2025.2");
    const previous = await makeEngine();
    for (const [gross, expected] of [[3000, 1.8], [8000, 2.4]] as const) {
      const values = { "salarié . contrat . salaire brut": `${gross} €/mois` };
      set(engine, values);
      set(previous, values);
      // 3 000 € × 0.06 %; above the 2026 ceiling (4 005 €), 4 005 € × 0.06 % = 2.403 €.
      assert.equal(Math.round((get(engine, joint).nodeValue as number) * 100) / 100, expected, `${gross} €`);
      assert.equal(Math.round((employer(engine) - employer(previous)) * 100) / 100, expected, `${gross} €`);
    }
  });

  it("does not apply to another agreement", async () => {
    const engine = await makeEngine("2025.2");
    set(engine, { "salarié . convention collective": "'droit commun'" });
    assert.equal(get(engine, joint).nodeValue, null);
  });
});

// Version 2026.1: article 20 of the accord of 2 July 2025 (KALIARTI000052344318), from 1 May 2026,
// 0.35 % of the gross payroll for the entities of 1 to 299 employees, on top of the legal
// contribution (0.55 % below 11 employees, 1 % from 11).
describe("IDCC 3253 — 2026.1, conventional training contribution", () => {
  const formation = "salarié . cotisations . formation professionnelle";
  const amount = (engine: Engine, rule = formation) =>
    Math.round((engine.evaluate(rule).nodeValue as number) * 100) / 100;

  it("comes into force on 1 May 2026 and cites the accord", () => {
    const version = COMPILED_VERSIONS[id]?.find((v) => v.version === "2026.1");
    assert.equal(version?.validFrom, "2026-05-01");
    assert.ok(version?.sources.some((source) => source.includes("KALITEXT000052344249")));
  });

  it("adds 0.35 % to the legal contribution below 300 employees", async () => {
    const engine = await makeEngine("2026.1");
    // 3 000 € × (0.55 % + 0.35 %), 3 000 € × (1 % + 0.35 %), 3 000 € × 1 %.
    for (const [effectif, expected] of [[5, 27], [50, 40.5], [299, 40.5], [300, 30]] as const) {
      set(engine, { "salarié . contrat . salaire brut": "3000 €/mois", "entreprise . salariés . effectif": effectif });
      assert.equal(amount(engine), expected, `effectif ${effectif}`);
    }
  });

  it("adds it to the employer contributions, besides the joint bodies contribution", async () => {
    const engine = await makeEngine("2026.1");
    const previous = await makeEngine("2025.2");
    const values = { "salarié . contrat . salaire brut": "3000 €/mois", "entreprise . salariés . effectif": 20 };
    set(engine, values);
    set(previous, values);
    const employer = "salarié . cotisations . employeur";
    // 3 000 € × 0.35 %.
    assert.equal(Math.round((amount(engine, employer) - amount(previous, employer)) * 100) / 100, 10.5);
    assert.equal(amount(engine, `${ns} . financement du paritarisme`), 1.8);
  });

  it("does not alter the formation contribution of another agreement", async () => {
    const engine = await makeEngine("2026.1");
    set(engine, { "salarié . convention collective": "'droit commun'", "salarié . contrat . salaire brut": "3000 €/mois", "entreprise . salariés . effectif": 50 });
    assert.equal(amount(engine), 30);
  });
});

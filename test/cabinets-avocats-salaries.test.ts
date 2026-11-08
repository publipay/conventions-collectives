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

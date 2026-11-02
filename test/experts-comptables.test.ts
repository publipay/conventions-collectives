import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0787-experts-comptables";
const ns = "salarié . convention collective . experts-comptables";

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

async function engineOf(revision: string, situation: Record<string, string | number>) {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === revision);
  assert.ok(version, `IDCC 787 ${revision} must be exported`);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "experts-comptables"],
  } as Rule;
  Object.assign(rules, await version.loadRules());
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    salarié: "oui",
    dirigeant: "non",
    "salarié . convention collective": "'experts-comptables'",
    "salarié . contrat . temps de travail . quotité": "100%",
    ...situation,
  });
  return engine;
}

const round = (value: unknown) => Math.round((value as number) * 100) / 100;

describe("IDCC 787 — accords n° 47 (2024.1) and n° 48 (2026.4)", () => {
  // Accord n° 47 (KALITEXT000048638263): 127,83 € and 77,60 € per point, indice 40 46 454 €.
  // Accord n° 48 (KALITEXT000053576549): 131,54 € and 79,85 € per point, indice 40 47 801 €.
  for (const [revision, annual, indice40] of [
    ["2024.1", 164 * 127.83 + 16 * 77.6, 46454],
    ["2026.4", 164 * 131.54 + 16 * 79.85, 47801],
  ] as const) {
    it(`${revision}: values the coefficient 180 and the indice 40 without a validation`, async () => {
      const engine = await engineOf(revision, { [`${ns} . coefficient`]: 180 });
      assert.equal(round(get(engine, "minimum annuel").nodeValue), round(annual));
      assert.equal(round(get(engine, "salaire minimum conventionnel").nodeValue), round(annual / 12));
      engine.setSituation({ ...engine.getSituation(), [`${ns} . coefficient`]: 40 });
      assert.equal(get(engine, "minimum annuel").nodeValue, indice40);
    });

    it(`${revision}: has no minimum out of the grid`, async () => {
      const engine = await engineOf(revision, { [`${ns} . coefficient`]: 100 });
      assert.equal(get(engine, "coefficient hors grille").nodeValue, true);
      assert.equal(get(engine, "minimum annuel").nodeValue, null);
      assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, null);
    });
  }
});

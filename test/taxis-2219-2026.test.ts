import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const ns = "salarié . convention collective . taxis";

async function makeEngine() {
  const version = COMPILED_VERSIONS["2219-taxis"]?.find((v) => v.version === "2026.1");
  assert.ok(version);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...new Set([...choice["une possibilité"], "taxis"])],
  } as Rule;
  Object.assign(rules, await version.loadRules());
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function evaluate(engine: Engine, classification: string, rule: string, quotite?: string) {
  engine.setSituation({
    "salarié . convention collective": "'taxis'",
    [`${ns} . classification`]: `'${classification}'`,
    "salarié . contrat . statut cadre": "non",
    ...(quotite ? { "salarié . contrat . temps de travail . quotité": quotite } : {}),
  });
  return engine.evaluate(`${ns} . ${rule}`).nodeValue as number;
}

// Amounts read in the accord of 28 April 2026 (KALITEXT000055028257), articles 2, 3 and 4.
const drivers: [string, number, number][] = [
  ["niveau 1 — conducteur débutant — non titulaire carte professionnelle", 1865.43, 12.3],
  ["niveau 2 — conducteur confirmé — non titulaire carte professionnelle", 1881.14, 12.4],
  ["niveau 1 — conducteur débutant — titulaire carte professionnelle", 1865.43, 12.3],
  ["niveau 2 — conducteur confirmé — titulaire carte professionnelle", 1881.14, 12.4],
  ["niveau 3 — conducteur confirmé — titulaire carte professionnelle", 1897, 12.51],
];
// Hourly rates of article 4; the monthly minimum is the model's derivation (rate x 151.67 h, rounded to the cent).
const nonDriving: [string, number, number][] = [
  ["non roulant — échelon I", 12.51, 1897.39],
  ["non roulant — échelon II", 12.57, 1906.49],
  ["non roulant — échelon III", 12.87, 1951.99],
  ["non roulant — échelon IV", 14.67, 2225],
  ["non roulant — échelon V", 16.74, 2538.96],
  ["non roulant — échelon VI", 18.85, 2858.98],
];

describe("IDCC 2219 — taxis, version 2026.1", () => {
  it("carries the five driver lines (monthly and hourly published amounts)", async () => {
    const engine = await makeEngine();
    for (const [classification, monthly, hourly] of drivers) {
      assert.equal(evaluate(engine, classification, "salaire minimum conventionnel"), monthly, classification);
      assert.equal(evaluate(engine, classification, "taux horaire minimum conventionnel"), hourly, classification);
    }
  });

  it("carries the six non-driving hourly rates and derived monthly minima", async () => {
    const engine = await makeEngine();
    for (const [classification, hourly, monthly] of nonDriving) {
      assert.equal(evaluate(engine, classification, "taux horaire minimum conventionnel"), hourly, classification);
      assert.equal(evaluate(engine, classification, "salaire minimum conventionnel"), monthly, classification);
    }
  });
});

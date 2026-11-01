import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const namespace = "salarié . convention collective . casinos";
const version = COMPILED_VERSIONS["2257-casinos"]?.find((entry) => entry.version === "2026.2");
assert.ok(version);
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "casinos"] } as Rule;
Object.assign(rules, await version.loadRules());
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function minimum(indice: number, filiere?: string, rule = "grille") {
  engine.setSituation({
    "salarié . convention collective": "'casinos'",
    [`${namespace} . indice`]: indice,
    ...(filiere ? { [`${namespace} . filière`]: `'${filiere}'` } : {}),
  });
  return engine.evaluate(`${namespace} . ${rule}`).nodeValue;
}

// Amounts of the avenant n° 40 of 7 January 2026 (KALITEXT000054040478), annexes 1 and 2, and of the avenant n° 25.
const machines: [number, number][] = [[100, 1850], [105, 1860], [110, 1870], [115, 1880], [120, 1896], [130, 1916], [135, 1959], [140, 2031], [155, 2252], [175, 2567], [205, 2989], [230, 3326]];
const restauration: [number, number][] = [[100, 1850], [105, 1860], [110, 1870], [115, 1880], [120, 1896], [130, 1916], [140, 2031], [155, 2252], [175, 2567], [205, 2989], [230, 3326]];

describe("IDCC 2257 casinos, version 2026.2", () => {
  it("keeps the traditional games grid by default", () => {
    assert.equal(minimum(150), 2176);
    assert.equal(minimum(200), 2935);
    assert.equal(minimum(155), 0);
  });
  it("carries the slot machines grid (annexe 1)", () => {
    for (const [indice, amount] of machines) assert.equal(minimum(indice, "machines à sous et autres filières"), amount, String(indice));
  });
  it("carries the catering grid (annexe 2)", () => {
    for (const [indice, amount] of restauration) assert.equal(minimum(indice, "restauration-hôtellerie"), amount, String(indice));
    assert.equal(minimum(135, "restauration-hôtellerie", "indice hors grille"), true);
  });
});

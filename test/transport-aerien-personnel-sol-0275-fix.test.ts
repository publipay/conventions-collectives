import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0275-transport-aerien-personnel-sol";
const ns = "salarié . convention collective . transport aérien personnel au sol";

async function makeEngine(versionName: string) {
  const version = COMPILED_VERSIONS[id]?.find((v) => v.version === versionName);
  assert.ok(version, versionName);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = {
    ...choice,
    "une possibilité": [...choice["une possibilité"], "transport aérien personnel au sol"],
  } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

function minimum(engine: Engine, coefficient: number, quotite?: string) {
  engine.setSituation({
    "salarié . convention collective": "'transport aérien personnel au sol'",
    [`${ns} . coefficient`]: coefficient,
    "salarié . contrat . statut cadre": "non",
    ...(quotite ? { "salarié . contrat . temps de travail . quotité": quotite } : {}),
  });
  return engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue;
}

// Amounts read in the avenant n° 100 of 2 April 2025 (KALITEXT000051909575), article 1.
const coefficients = [160, 165, 175, 185, 190, 195, 200, 220, 235, 245, 260, 270, 290, 295, 300, 360, 420, 510, 600, 750];
const grids: Record<string, number[]> = {
  "2025.4": [1845, 1855, 1865, 1885, 1895, 1915, 1925, 1965, 2075, 2105, 2205, 2275, 2425, 2445, 2645, 2985, 3435, 4115, 4795, 5925],
};

describe("IDCC 275 — avenant n° 100, last step (2025.4)", () => {
  for (const [version, amounts] of Object.entries(grids)) {
    it(`carries the full grid of ${version}`, async () => {
      const engine = await makeEngine(version);
      coefficients.forEach((coefficient, i) => assert.equal(minimum(engine, coefficient), amounts[i], `${version} coefficient ${coefficient}`));
    });
  }

  it("prorates part-time once", async () => {
    const engine = await makeEngine("2025.4");
    assert.equal(minimum(engine, 245, "50 %"), 1052.5);
    assert.equal(minimum(engine, 160, "80 %"), 1476);
  });

  it("reports an out-of-grid coefficient", async () => {
    const engine = await makeEngine("2025.4");
    assert.equal(minimum(engine, 999), null);
    assert.equal(engine.evaluate(`${ns} . coefficient hors grille`).nodeValue, true);
  });
});

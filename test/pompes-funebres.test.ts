import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const id = "0759-pompes-funebres";
const ns = "salarié . convention collective . pompes funèbres";

const get = (engine: Engine, rule: string) => engine.evaluate(`${ns} . ${rule}`);

// Amounts below are typed from the annexes on Légifrance (embauche, 3, 5, 10, 15, 20, 25 ans; cadres: embauche, 3 ans).
const STEPS = [0, 3, 5, 10, 15, 20, 25];
const GRIDS: Record<string, Record<string, number[]>> = {
  "2025": {
    "I.1": [1836, 1892, 1911, 1950, 1989, 2029, 2070],
    "II.1": [1843, 1899, 1918, 1957, 1997, 2037, 2078],
    "II.2": [1862, 1918, 1937, 1976, 2016, 2057, 2099],
    "III.1": [1880, 1937, 1957, 1997, 2037, 2078, 2120],
    "III.2": [1899, 1956, 1976, 2016, 2057, 2099, 2141],
    "IV.1": [1976, 2036, 2057, 2099, 2141, 2184, 2228],
    "IV.2": [2032, 2094, 2115, 2158, 2202, 2247, 2292],
    "V.1": [2464, 2538],
    "V.2": [2627, 2707],
    "VI.1": [2905, 2993],
    "VI.2": [3423, 3526],
    "VII.1": [4224, 4352],
  },
  "2026": {
    "I.1": [1864, 1921, 1940, 1980, 2019, 2060, 2102],
    "II.1": [1871, 1928, 1947, 1987, 2027, 2068, 2110],
    "II.2": [1890, 1947, 1967, 2006, 2047, 2088, 2131],
    "III.1": [1909, 1967, 1987, 2027, 2068, 2110, 2152],
    "III.2": [1928, 1986, 2006, 2047, 2088, 2131, 2174],
    "IV.1": [2006, 2067, 2088, 2131, 2174, 2217, 2262],
    "IV.2": [2063, 2126, 2147, 2191, 2236, 2281, 2327],
    "V.1": [2501, 2577],
    "V.2": [2667, 2748],
    "VI.1": [2949, 3038],
    "VI.2": [3475, 3579],
    "VII.1": [4288, 4418],
  },
};
const VERSIONS: Record<string, { grid: string; validFrom: string }> = {
  "2025.1": { grid: "2025", validFrom: "2025-01-01" },
  "2026.1": { grid: "2026", validFrom: "2026-01-01" },
};

async function engineFor(revision: string, niveau: string, position: number, anciennete: number, quotite = "100%") {
  const version = COMPILED_VERSIONS[id]?.find((candidate) => candidate.version === revision);
  assert.ok(version, revision);
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "pompes funèbres"] } as Rule;
  Object.assign(rules, await version.loadRules());
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    salarié: "oui",
    dirigeant: "non",
    "salarié . convention collective": "'pompes funèbres'",
    [`${ns} . niveau`]: `'${niveau}'`,
    [`${ns} . position`]: position,
    [`${ns} . ancienneté dans l'emploi`]: anciennete,
    "salarié . contrat . temps de travail . quotité": quotite,
  });
  return engine;
}

describe("IDCC 759 — grids of 2025 and 2026", () => {

  for (const [revision, { grid }] of Object.entries(VERSIONS)) {
    it(`gives every cell of the ${grid} annex (${revision})`, async () => {
      for (const [key, values] of Object.entries(GRIDS[grid]!)) {
        const [niveau, position] = key.split(".") as [string, string];
        for (const [index, expected] of values.entries()) {
          const years = STEPS[index]!;
          const engine = await engineFor(revision, niveau, Number(position), years);
          assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, expected, `${revision} ${key} ${years} ans`);
        }
      }
    });
  }

  it("keeps the step values between two seniority thresholds", async () => {
    const engine = await engineFor("2026.1", "I", 1, 4);
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 1921);
    const cadre = await engineFor("2026.1", "VII", 1, 2);
    assert.equal(get(cadre, "salaire minimum conventionnel").nodeValue, 4288);
  });

  it("prorates part time", async () => {
    const engine = await engineFor("2026.1", "VII", 1, 4, "50%");
    assert.equal(get(engine, "salaire minimum conventionnel").nodeValue, 2209);
    const other = await engineFor("2026.1", "IV", 2, 25, "80%");
    assert.equal(get(other, "salaire minimum conventionnel").nodeValue, 1861.6);
  });
});

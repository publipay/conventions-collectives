import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

describe("IDCC 3236 industrie et services nautiques — version 2025.2", () => {
  const namespace = "salarié . convention collective . industrie services nautiques";

  async function makeEngine() {
    const version = COMPILED_VERSIONS["3236-industrie-services-nautiques"]?.find((v) => v.version === "2025.2");
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  }

  function minimum(engine: Engine, level: string, quotite?: string) {
    engine.setSituation({
      "salarié . convention collective": "'industrie services nautiques'",
      [`${namespace} . niveau et échelon`]: `'${level}'`,
      "salarié . contrat . statut cadre": "non",
      ...(quotite ? { "salarié . contrat . temps de travail . quotité": quotite } : {}),
    });
    return Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 100) / 100;
  }

  it("carries every row of the 16 April 2025 annex (amounts read in the text)", async () => {
    const engine = await makeEngine();
    const expected: Record<string, number> = {
      "I.1": 1801.8, "I.2": 1842.24, "II.1": 1852.62, "II.2": 1863.96, "II.3": 1888.21,
      "III.1": 1912.44, "III.2": 1940.71, "III.3": 1955.52, "IV.1": 1955.52, "IV.2": 1972.75,
      "V.1": 1993.31, "V.2": 2090.19, "VI.1": 2279.21, "VI.2": 2477.87,
      "VII.1": 2291.16, "VII.2": 2500.6, "VII.3": 3667.22, "VII.4": 5103.16,
    };
    for (const [level, amount] of Object.entries(expected)) {
      assert.equal(minimum(engine, level), amount, level);
    }
  });

  it("prorates part-time once", async () => {
    const engine = await makeEngine();
    assert.equal(minimum(engine, "III.2", "50 %"), 970.36);
  });

  it("reports an out-of-grid level", async () => {
    const engine = await makeEngine();
    assert.equal(minimum(engine, "VIII.1"), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true);
  });
});

describe("IDCC 3236 industrie et services nautiques — version 2026.1", () => {
  const namespace = "salarié . convention collective . industrie services nautiques";
  const version = COMPILED_VERSIONS["3236-industrie-services-nautiques"]?.find((v) => v.version === "2026.1");

  async function makeEngine() {
    assert.ok(version);
    const rules: Record<string, Rule> = { ...modeleSocial, ...(await version.loadRules()) };
    return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  }

  function minimum(engine: Engine, level: string, quotite?: string) {
    engine.setSituation({
      "salarié . convention collective": "'industrie services nautiques'",
      [`${namespace} . niveau et échelon`]: `'${level}'`,
      "salarié . contrat . statut cadre": "non",
      ...(quotite ? { "salarié . contrat . temps de travail . quotité": quotite } : {}),
    });
    return Math.round((engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue as number) * 100) / 100;
  }

  it("is effective on 1 June 2026 and extended on 30 September 2026", () => {
    assert.equal(version?.validFrom, "2026-06-01");
    assert.equal(version?.extension, "2026-09-30");
    assert.ok(version?.sources.some((source) => source.includes("KALITEXT000055051420")));
  });

  it("carries every row of the 10 July 2026 avenant (amounts read in the text)", async () => {
    const engine = await makeEngine();
    const expected: Record<string, number> = {
      "I.1": 1867.02, "I.2": 1880.92, "II.1": 1895.23, "II.2": 1910.19, "II.3": 1930.7,
      "III.1": 1953.75, "III.2": 1975.64, "III.3": 1996.58, "IV.1": 1998.54, "IV.2": 2012.21,
      "V.1": 2033.17, "V.2": 2131.99, "VI.1": 2308.84, "VI.2": 2507.61,
      "VII.1": 2355.32, "VII.2": 2570.62, "VII.3": 3685.55, "VII.4": 5128.67,
    };
    for (const [level, amount] of Object.entries(expected)) {
      assert.equal(minimum(engine, level), amount, level);
    }
  });

  it("prorates part-time once", async () => {
    const engine = await makeEngine();
    assert.equal(minimum(engine, "III.2", "50 %"), 987.82);
  });

  it("reports an out-of-grid level", async () => {
    const engine = await makeEngine();
    assert.equal(minimum(engine, "VIII.1"), 0);
    assert.equal(engine.evaluate(`${namespace} . niveau et échelon hors grille`).nodeValue, true);
  });
});

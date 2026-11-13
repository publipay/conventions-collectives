import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const value = "agents de direction sécurité sociale";
const namespace = `salarié . convention collective . ${value}`;

async function makeEngine(versionName = "2025.2") {
  const version = COMPILED_VERSIONS["3232-agents-direction-securite-sociale"]?.find((v) => v.version === versionName);
  assert.ok(version);
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  for (const name of Object.keys(extension)) {
    assert.ok(name === namespace || name.startsWith(`${namespace} . `), name);
    assert.ok(!(name in rules), `Duplicate modele-social rule: ${name}`);
  }
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
  Object.assign(rules, extension);
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

describe("IDCC 3232 agents de direction sécurité sociale — 2026.2", () => {
  const rule = (name: string) => `${namespace} . ${name}`;
  const zones: [number, number][] = [[1, 1089.94], [2, 871.95], [3, 544.97]];

  for (const [zone, amount] of zones) {
    it(`pays the 2026 double-residence base of zone ${zone}`, async () => {
      const engine = await makeEngine("2026.2");
      engine.setSituation({ "salarié . convention collective": `'${value}'`, [rule("zone double résidence")]: zone });
      assert.ok(Math.abs((engine.evaluate(rule("indemnité double résidence")).nodeValue as number) - amount) < 1e-9);
    });
  }

  it("adds 54.29 euros per child", async () => {
    const engine = await makeEngine("2026.2");
    engine.setSituation({ "salarié . convention collective": `'${value}'`, [rule("zone double résidence")]: 1, [rule("enfants à charge")]: 2 });
    assert.ok(Math.abs((engine.evaluate(rule("indemnité double résidence")).nodeValue as number) - 1198.52) < 1e-9);
  });

  it("gives no base amount for an unknown zone", async () => {
    const engine = await makeEngine("2026.2");
    engine.setSituation({ "salarié . convention collective": `'${value}'`, [rule("zone double résidence")]: 4 });
    assert.equal(engine.evaluate(rule("montant de base double résidence")).nodeValue, 0);
  });

  it("exposes the 2026 vehicle-loan caps", async () => {
    const engine = await makeEngine("2026.2");
    engine.setSituation({ "salarié . convention collective": `'${value}'` });
    assert.equal(engine.evaluate(rule("plafond prêt automobile")).nodeValue, 9051.92);
    assert.equal(engine.evaluate(rule("plafond renouvellement prêt automobile")).nodeValue, 5966);
  });

  it("selects the version in force by date", () => {
    const versions = COMPILED_VERSIONS["3232-agents-direction-securite-sociale"] ?? [];
    assert.ok(versions.some((v) => v.version === "2026.2"));
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "0675-succursales-habillement";
const value = "succursales habillement";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2026.3");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);

function engineFor(level: string, seniority: string, forfait: string) {
  const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${level}'`,
    "salarié . ancienneté": seniority,
    [`${namespace} . forfait jours`]: forfait,
  });
  return engine;
}

describe("IDCC 675 — 2026.3 payroll rules", () => {

  it("keeps the new payroll rules isolated outside IDCC 675", () => {
    const engine = engineFor("E4", "6 an", "non");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . prime d'ancienneté`).nodeValue, null);
    assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel forfait jours`).nodeValue, null);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const agreement = "2707-batiment-etam-ile-de-france";
const value = "bâtiment ETAM Île-de-France";
const namespace = `salarié . convention collective . ${value}`;
const version = COMPILED_VERSIONS[agreement]?.find((entry) => entry.version === "2018.2");
assert.ok(version);
const extension = await version.loadRules();
const rules: Record<string, Rule> = { ...modeleSocial };
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], value] } as Rule;
Object.assign(rules, extension);
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });

function setSituation(niveau: string, quotité = "100%") {
  engine.setSituation({
    "salarié . convention collective": `'${value}'`,
    [`${namespace} . niveau`]: `'${niveau}'`,
    "salarié . contrat . temps de travail . quotité": quotité,
  });
}

describe("IDCC 2707 — 2018.2 salaires et audit paie", () => {
  it("uses the official salary text, convention and extension references", () => {
    assert.equal(version.validFrom, "2018-01-01");
    assert.ok(version.sources.some((source) => source.includes("KALITEXT000037172865")));
    assert.ok(version.sources.some((source) => source.includes("KALICONT000024794551")));
    assert.ok(version.sources.some((source) => source.includes("2018/12/30/0302")));
  });

  it("is inapplicable for another collective agreement", () => {
    setSituation("A");
    engine.setSituation({ "salarié . convention collective": "'droit commun'" });
    assert.equal(engine.evaluate(`${namespace} . salaire minimum conventionnel`).nodeValue, null);
  });
});

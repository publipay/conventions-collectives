import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import {
  compare,
  isMentioned,
  listTexts,
  missingSharedTexts,
  readAgreements,
  readMentions,
  signatureDate,
  textNumber,
} from "../scripts/check-new-texts.ts";

test("reads the signature date from a Légifrance title", () => {
  assert.equal(signatureDate("Avenant n° 210 du 3 avril 2025 relatif aux salaires"), "2025-04-03");
  assert.equal(signatureDate("Accord du 1er juillet 2025 relatif à la prévoyance"), "2025-07-01");
  assert.equal(signatureDate("Avenant du 12 Décembre 2024"), "2024-12-12");
  assert.equal(signatureDate("Accord des 5 et 26 janvier 2005 relatif à la création d'une CPNEF"), "2005-01-05");
  assert.equal(signatureDate("Annexe 9 Accord 29 décembre 2020 relatif à l'APLD"), "2020-12-29");
  assert.equal(signatureDate("Annexe I  Accord du 6 janvier  1970 sur la réduction"), "1970-01-06");
  assert.equal(signatureDate("Convention collective nationale du sport"), undefined);
  assert.equal(signatureDate("Annexe 2-3 - annualisation des horaires de travail"), undefined);
});

test("collects the cited texts of each agreement, shared files included", () => {
  const agreements = readAgreements();
  const sport = agreements.find((agreement) => agreement.idcc === "2511");
  assert.ok(sport?.citedTexts.has("KALITEXT000053401858"));
  const building = agreements.find((agreement) => agreement.idcc === "1596");
  assert.ok(building?.directories.includes("commun/batiment"));
  assert.equal(new Set(agreements.map((agreement) => agreement.idcc)).size, agreements.length);
});

const container = {
  id: "KALICONT000017577652",
  titre: "Convention collective nationale du sport",
  sections: [
    { id: "KALITEXT000017577657", title: "Convention collective nationale du sport du 7 juillet 2005", etat: "VIGUEUR_ETEN" },
    {
      title: "Textes Attachés",
      sections: [
        { id: "KALITEXT000053401858", title: "Avenant n° 214 du 23 septembre 2025 relatif au paritarisme", etat: "VIGUEUR_ETEN" },
        { id: "KALITEXT000000000003", title: "Avenant n° 216 du 20 novembre 2025 relatif au dialogue social", etat: "VIGUEUR_NON_ETEN" },
        { id: "KALITEXT000000000004", title: "Avenant n° 150 du 2 mai 2020", etat: "VIGUEUR_ETEN" },
        { id: "KALITEXT000000000005", title: "Avenant n° 220 du 5 mars 2026", etat: "ABROGE" },
        { id: "KALITEXT000000000008", title: "Annexe I - Ouvriers et employés", etat: "VIGUEUR_ETEN", dateModif: "2000-01-01" },
        { id: "KALITEXT000000000009", title: "Annexe II - Cadres", etat: "VIGUEUR_ETEN", dateModif: "2026-05-13" },
      ],
    },
    {
      title: "Textes Salaires",
      sections: [
        { id: "KALITEXT000000000006", title: "Avenant n° 210 du 3 avril 2025 relatif aux salaires", etat: "VIGUEUR_ETEN" },
        { id: "KALITEXT000000000007", title: "Avenant n° 221 du 9 avril 2026 relatif aux salaires", etat: "VIGUEUR_NON_ETEN" },
      ],
    },
  ],
};

test("lists the texts of a container with their group", () => {
  const texts = listTexts(container);
  assert.equal(texts.length, 9);
  assert.equal(texts.find((text) => text.id === "KALITEXT000000000008")?.modifiedOn, "2000-01-01");
  assert.deepEqual(texts[0], {
    id: "KALITEXT000017577657",
    title: "Convention collective nationale du sport du 7 juillet 2005",
    state: "VIGUEUR_ETEN",
    group: "Texte de base",
    signedOn: "2005-07-07",
  });
  assert.equal(texts.find((text) => text.id === "KALITEXT000000000007")?.group, "Textes Salaires");
});

test("reports the uncited texts in force signed after the latest cited one", () => {
  const agreement = {
    idcc: "2511",
    directories: ["2511-sport"],
    citedTexts: new Set(["KALITEXT000053401858", "KALITEXT000000000006", "KALITEXT000099999999"]),
    ownTexts: new Set(["KALITEXT000053401858", "KALITEXT000000000006", "KALITEXT000099999999"]),
    mentions: new Set<string>(),
    containers: new Set<string>(),
  };
  const report = compare(agreement, listTexts(container));
  assert.equal(report.latestCitedDate, "2025-09-23");
  assert.deepEqual(
    report.newTexts.map((text) => text.id),
    ["KALITEXT000000000003", "KALITEXT000000000007", "KALITEXT000000000009"],
  );
  assert.deepEqual(report.changedTexts, []);
  assert.deepEqual(report.missingTexts, ["KALITEXT000099999999"]);

  const all = compare(agreement, listTexts(container), { all: true });
  assert.deepEqual(
    all.newTexts.map((text) => text.id),
    [
      "KALITEXT000000000008",
      "KALITEXT000017577657",
      "KALITEXT000000000004",
      "KALITEXT000000000003",
      "KALITEXT000000000007",
      "KALITEXT000000000009",
    ],
  );
});

test("reports the cited texts not extended or no longer in force", () => {
  const agreement = {
    idcc: "2511",
    directories: ["2511-sport"],
    citedTexts: new Set(["KALITEXT000000000005", "KALITEXT000000000007"]),
    ownTexts: new Set(["KALITEXT000000000005", "KALITEXT000000000007"]),
    mentions: new Set<string>(),
    containers: new Set<string>(),
  };
  const report = compare(agreement, listTexts(container));
  assert.deepEqual(
    report.changedTexts.map((text) => `${text.id} ${text.state}`),
    ["KALITEXT000000000005 ABROGE", "KALITEXT000000000007 VIGUEUR_NON_ETEN"],
  );
});

test("a text cited by a shared directory is missing only when none of its agreements lists it", () => {
  const shared = {
    directory: "commun/batiment",
    idccs: ["1596", "1597"],
    citedTexts: new Set(["KALITEXT000000000001", "KALITEXT000000000002", "KALITEXT000000000003"]),
    mentions: new Set<string>(),
  };
  const listed = new Map([
    ["1596", new Set(["KALITEXT000000000001"])],
    ["1597", new Set(["KALITEXT000000000002"])],
  ]);
  assert.deepEqual(missingSharedTexts(shared, listed), ["KALITEXT000000000003"]);
  assert.equal(missingSharedTexts(shared, new Map([["1596", new Set<string>()]])), undefined);
});

test("missing texts of an agreement leave out the shared files' citations", () => {
  const agreement = {
    idcc: "2511",
    directories: ["2511-sport"],
    citedTexts: new Set(["KALITEXT000053401858", "KALITEXT000088888888"]),
    ownTexts: new Set(["KALITEXT000053401858"]),
    mentions: new Set<string>(),
    containers: new Set<string>(),
  };
  assert.deepEqual(compare(agreement, listTexts(container)).missingTexts, []);
});

test("recognises the texts cited by name instead of by id", () => {
  assert.equal(textNumber("Avenant n° S 70 du 23 juin 2026 relatif aux salaires"), "s70");
  assert.equal(textNumber("Avenant n° 2026/1 relatif aux salaires minima"), "2026/1");
  assert.equal(textNumber("Accord du 17 juin 2026 relatif aux salaires"), undefined);

  const directory = mkdtempSync(join(tmpdir(), "mentions-"));
  writeFileSync(
    join(directory, "README.md"),
    "Grille de l'avenant n° 36 du 4 juin 2026, étendu par arrêté du 12 octobre 2026.\n" +
      "Taux de l'accord du\n17 juin 2026 (JORF du 4 septembre 2026), applicable à partir du 1er juillet 2026.",
  );
  const mentions = readMentions(directory);
  const text = (title: string) => ({ id: "", title, state: "", group: "", signedOn: signatureDate(title) });
  assert.ok(isMentioned({ mentions }, text("Avenant n° 36 du 4 juin 2026 relatif aux salaires")));
  assert.ok(!isMentioned({ mentions }, text("Avenant n° 37 du 4 juin 2026 relatif à la prévoyance")));
  assert.ok(isMentioned({ mentions }, text("Accord du 17 juin 2026 relatif aux salaires minima")));
  assert.ok(isMentioned({ mentions }, text("Avenant n° 2 du 17 juin 2026"))); // the mention has no number
  assert.ok(!isMentioned({ mentions }, text("Arrêté du 12 octobre 2026")));
  assert.ok(!isMentioned({ mentions }, text("Accord du 1er juillet 2026 relatif aux salaires")));
});

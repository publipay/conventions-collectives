/**
 * Lists, for each agreement in rules/, the texts in force on Légifrance that its sources do not
 * cite yet and that were signed after the most recent text they cite: new wage agreements,
 * provident or joint body amendments, etc. Also lists the cited texts whose state changed
 * (extended since, or no longer in force).
 *
 * The data comes from the Légifrance API of the DILA, on PISTE (https://piste.gouv.fr): create an
 * application subscribed to the Légifrance API and set PISTE_CLIENT_ID and PISTE_CLIENT_SECRET, or
 * store them in the macOS keychain as the generic passwords piste-client-id and piste-client-secret.
 *
 *   node scripts/check-new-texts.ts [--sandbox] [--json] [--all] [<idcc> ...]
 *
 * --all lists every uncited text in force, whatever its date. The script only reads: it neither
 * changes the rules nor tells whether a text changes an amount; read each text before using it.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseAllDocuments } from "yaml";

const RULES_DIR = "rules";
const SHARED_DIR = join(RULES_DIR, "commun");
const AGREEMENT_DIR = /^(\d{4})-[a-z][a-z0-9-]*$/;
const TEXT_ID = /KALITEXT\d{12}/g;

const HOSTS = {
  production: {
    api: "https://api.piste.gouv.fr/dila/legifrance/lf-engine-app",
    token: "https://oauth.piste.gouv.fr/api/oauth/token",
  },
  sandbox: {
    api: "https://sandbox-api.piste.gouv.fr/dila/legifrance/lf-engine-app",
    token: "https://sandbox-oauth.piste.gouv.fr/api/oauth/token",
  },
};

/**
 * citedTexts includes the shared files' citations; ownTexts only the agreement's directories'.
 * mentions holds the texts cited by name ("Avenant n° 36 du 4 juin 2026"), see readMentions.
 */
export type Agreement = {
  idcc: string;
  directories: string[];
  citedTexts: Set<string>;
  ownTexts: Set<string>;
  mentions: Set<string>;
  /** KALICONT ids cited in the agreement's directories: the fallback when the IDCC lookup fails. */
  containers: Set<string>;
};

/** A directory of rules/commun, with the IDCCs that publish it and the texts it cites. */
export type SharedDirectory = {
  directory: string;
  idccs: string[];
  citedTexts: Set<string>;
  mentions: Set<string>;
};

export type LegifranceText = {
  id: string;
  title: string;
  state: string;
  group: string;
  signedOn?: string;
  /** Légifrance's last modification date of the text, the fallback when its title has no date. */
  modifiedOn?: string;
};

export type Report = {
  idcc: string;
  directories: string[];
  title?: string;
  latestCitedDate?: string;
  newTexts: LegifranceText[];
  changedTexts: LegifranceText[];
  missingTexts: string[];
  error?: string;
};

/** The agreements of rules/, with the KALITEXT ids cited in their files and in the shared files. */
export function readAgreements(rulesDir = RULES_DIR): Agreement[] {
  const byName = new Map<string, Agreement>();
  for (const entry of readdirSync(rulesDir, { withFileTypes: true })) {
    const match = AGREEMENT_DIR.exec(entry.name);
    if (!entry.isDirectory() || !match) continue;
    const cited = citedTexts(join(rulesDir, entry.name));
    byName.set(entry.name, {
      idcc: match[1] as string,
      directories: [entry.name],
      citedTexts: new Set(cited),
      ownTexts: cited,
      mentions: readMentions(join(rulesDir, entry.name)),
      containers: citedContainers(join(rulesDir, entry.name)),
    });
  }

  for (const shared of readSharedDirectories(rulesDir, byName)) {
    for (const name of shared.names) {
      const agreement = byName.get(name) as Agreement;
      for (const id of shared.citedTexts) agreement.citedTexts.add(id);
      for (const key of shared.mentions) agreement.mentions.add(key);
      agreement.directories.push(shared.directory);
    }
  }

  // Several directories may share an IDCC: Légifrance has one container per IDCC.
  const byIdcc = new Map<string, Agreement>();
  for (const agreement of byName.values()) {
    const existing = byIdcc.get(agreement.idcc);
    if (!existing) {
      byIdcc.set(agreement.idcc, agreement);
      continue;
    }
    existing.directories.push(...agreement.directories);
    for (const id of agreement.citedTexts) existing.citedTexts.add(id);
    for (const id of agreement.ownTexts) existing.ownTexts.add(id);
    for (const key of agreement.mentions) existing.mentions.add(key);
    for (const id of agreement.containers) existing.containers.add(id);
  }
  return [...byIdcc.values()].sort((a, b) => a.idcc.localeCompare(b.idcc));
}

/** The directories of rules/commun, with the agreements (directory names and IDCCs) that publish them. */
export function readSharedDirectories(
  rulesDir = RULES_DIR,
  agreements?: Map<string, unknown>,
): (SharedDirectory & { names: string[] })[] {
  const sharedDir = join(rulesDir, "commun");
  return readdirSync(sharedDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const directory = join(sharedDir, entry.name);
      const names = [...sharedAgreements(directory)];
      for (const name of names) {
        if (!AGREEMENT_DIR.test(name) || (agreements && !agreements.has(name))) {
          throw new Error(`${directory}: unknown agreement ${name}`);
        }
      }
      return {
        directory: join("commun", entry.name),
        names,
        idccs: [...new Set(names.map((name) => name.slice(0, 4)))],
        citedTexts: citedTexts(directory),
        mentions: readMentions(directory),
      };
    });
}

/**
 * The texts a shared directory cites that none of its agreements lists: a shared file may cite
 * the texts of each of its agreements, so a text is only missing when no container has it.
 */
export function missingSharedTexts(
  shared: SharedDirectory,
  listedByIdcc: Map<string, Set<string>>,
): string[] | undefined {
  const listed = shared.idccs.map((idcc) => listedByIdcc.get(idcc));
  if (listed.some((ids) => ids === undefined)) return undefined;
  return [...shared.citedTexts].filter((id) => !listed.some((ids) => ids?.has(id))).sort();
}

const TEXT_NUMBER = /\bn°\s*((?:[a-z]\s)?[\w/.-]*\d[\w/.-]*)/i;
const normalizeNumber = (number: string) => number.replace(/\s+/g, "").replace(/\.$/, "").toLowerCase();

/** The number of a text, from its title ("Avenant n° S 70 du …" gives "s70"). */
export function textNumber(title: string): string | undefined {
  const match = TEXT_NUMBER.exec(title);
  return match ? normalizeNumber(match[1] as string) : undefined;
}

/**
 * The texts a directory cites by name rather than by KALITEXT id (sources often link the
 * extension order instead): a kind of text followed, in the same sentence, by "du <date>", as in
 * "Avenant n° 36 du 4 juin 2026" or "accord du 17 juin 2026". Keys are "<date>|<number>",
 * "<date>|" for a mention without number, and "<date>|*" for any mention at that date.
 */
export function readMentions(directory: string): Set<string> {
  const keys = new Set<string>();
  const mention = new RegExp(
    `\\b(?:accords?|avenants?|protocoles?|annexes?|adhésion|avis)\\b([^.\\n]{0,80}?)\\bdu\\s+` +
      `((?:1er|\\d{1,2})\\s+(?:${MONTHS.join("|")})\\s+\\d{4})`,
    "gi",
  );
  for (const file of readdirSync(directory)) {
    const content = readFileSync(join(directory, file), "utf8").normalize("NFC").replace(/\s+/g, " ");
    for (const match of content.matchAll(mention)) {
      const date = signatureDate(match[2] as string);
      if (!date) continue;
      const number = textNumber(match[1] as string);
      keys.add(`${date}|${number ?? ""}`);
      keys.add(`${date}|*`);
    }
  }
  return keys;
}

/** Whether the agreement's files cite the text by name (see readMentions). */
export function isMentioned(agreement: Pick<Agreement, "mentions">, text: LegifranceText): boolean {
  if (!text.signedOn) return false;
  const number = textNumber(text.title);
  return number === undefined
    ? agreement.mentions.has(`${text.signedOn}|*`)
    : agreement.mentions.has(`${text.signedOn}|${number}`) ||
        agreement.mentions.has(`${text.signedOn}|`);
}

function citedContainers(directory: string): Set<string> {
  const ids = new Set<string>();
  for (const file of readdirSync(directory)) {
    for (const id of readFileSync(join(directory, file), "utf8").match(/KALICONT\d{12}/g) ?? []) ids.add(id);
  }
  return ids;
}

function citedTexts(directory: string): Set<string> {
  const ids = new Set<string>();
  for (const file of readdirSync(directory)) {
    for (const id of readFileSync(join(directory, file), "utf8").match(TEXT_ID) ?? []) ids.add(id);
  }
  return ids;
}

function sharedAgreements(directory: string): Set<string> {
  const names = new Set<string>();
  for (const file of readdirSync(directory).filter((name) => name.endsWith(".publicodes"))) {
    const [metadata] = parseAllDocuments(readFileSync(join(directory, file), "utf8")) as {
      toJS(): unknown;
    }[];
    const agreements = (metadata?.toJS() as { agreements?: string[] } | null)?.agreements ?? [];
    for (const name of agreements) names.add(name);
  }
  return names;
}

const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
// "du 3 avril 2025", "des 5 et 26 janvier 2005" (the first day), "Accord 29 décembre 2020".
const TITLE_DATE = new RegExp(
  `(?:^|\\s)(1er|\\d{1,2})(?:\\s+et\\s+(?:1er|\\d{1,2}))?\\s+(${MONTHS.join("|")})\\s+(\\d{4})\\b`,
  "i",
);

/** The signature date of a text, from its title ("Avenant n° 210 du 3 avril 2025 …"). */
export function signatureDate(title: string): string | undefined {
  const match = TITLE_DATE.exec(title.normalize("NFC"));
  if (!match) return undefined;
  const [, day, month, year] = match as unknown as [string, string, string, string];
  const monthNumber = MONTHS.indexOf(month.toLowerCase()) + 1;
  const dayNumber = day === "1er" ? 1 : Number(day);
  return `${year}-${String(monthNumber).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
}

type ApiSection = {
  id?: string;
  title?: string;
  titre?: string;
  etat?: string;
  dateModif?: string | null;
  sections?: ApiSection[];
};

/** The texts listed in a kaliCont response, with the heading of their group. */
export function listTexts(container: ApiSection): LegifranceText[] {
  const texts: LegifranceText[] = [];
  const visit = (section: ApiSection, group: string) => {
    if (section.id?.startsWith("KALITEXT")) {
      const title = section.title ?? section.titre ?? "";
      texts.push({
        id: section.id,
        title,
        state: section.etat ?? "",
        group,
        signedOn: signatureDate(title),
        ...(section.dateModif ? { modifiedOn: section.dateModif } : {}),
      });
      return;
    }
    for (const child of section.sections ?? []) {
      visit(child, group || (child.title ?? ""));
    }
  };
  for (const section of container.sections ?? []) {
    visit(section, section.id?.startsWith("KALITEXT") ? "Texte de base" : (section.title ?? ""));
  }
  return texts;
}

const inForce = (text: LegifranceText) => text.state.startsWith("VIGUEUR");

/** Compares the texts of the container with the ones the agreement cites. */
export function compare(
  agreement: Agreement,
  texts: LegifranceText[],
  options: { all?: boolean } = {},
): Omit<Report, "title"> {
  const listed = new Map(texts.map((text) => [text.id, text]));
  const isCited = (text: LegifranceText) =>
    agreement.citedTexts.has(text.id) || isMentioned(agreement, text);
  const cited = texts.filter(isCited);
  const textDate = (text: LegifranceText) => text.signedOn ?? text.modifiedOn;
  const latestCitedDate = cited
    .map(textDate)
    .filter((date): date is string => date !== undefined)
    .sort()
    .at(-1);

  const newTexts = texts.filter(
    (text) =>
      inForce(text) &&
      !isCited(text) &&
      (options.all ||
        latestCitedDate === undefined ||
        textDate(text) === undefined ||
        (textDate(text) as string) > latestCitedDate),
  );
  // Texts cited by id no longer in force, or in force but not extended: worth a look either way.
  const changedTexts = texts.filter(
    (text) =>
      agreement.citedTexts.has(text.id) && (!inForce(text) || text.state === "VIGUEUR_NON_ETEN"),
  );
  const missingTexts = [...agreement.ownTexts].filter((id) => !listed.has(id)).sort();
  return {
    idcc: agreement.idcc,
    directories: agreement.directories,
    latestCitedDate,
    newTexts: newTexts.sort((a, b) => (textDate(a) ?? "").localeCompare(textDate(b) ?? "")),
    changedTexts,
    missingTexts,
  };
}

class Legifrance {
  #token?: string;
  readonly hosts: { api: string; token: string };
  readonly clientId: string;
  readonly clientSecret: string;

  constructor(hosts: { api: string; token: string }, clientId: string, clientSecret: string) {
    this.hosts = hosts;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async token(): Promise<string> {
    if (this.#token) return this.#token;
    const response = await fetch(this.hosts.token, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        scope: "openid",
      }),
    });
    if (!response.ok) {
      throw new Error(`PISTE token: HTTP ${response.status} ${await response.text()}`);
    }
    this.#token = ((await response.json()) as { access_token: string }).access_token;
    return this.#token;
  }

  async post(path: string, body: object, attempt = 1): Promise<unknown> {
    const response = await fetch(`${this.hosts.api}/${path}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${await this.token()}`,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.status === 401 && attempt === 1) {
      this.#token = undefined;
      return this.post(path, body, attempt + 1);
    }
    if ((response.status === 429 || response.status >= 500) && attempt < 5) {
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt));
      return this.post(path, body, attempt + 1);
    }
    if (!response.ok) {
      throw new Error(`${path}: HTTP ${response.status} ${await response.text()}`);
    }
    return response.json();
  }

  /**
   * The container of an agreement, from its IDCC. The IDCC lookup fails (HTTP 500) for some
   * agreements: the KALICONT ids their sources cite are tried next, the first that answers wins.
   */
  async container(idcc: string, containers: Iterable<string> = []): Promise<ApiSection & { titre?: string }> {
    try {
      return (await this.post("consult/kaliContIdcc", { id: idcc })) as ApiSection;
    } catch (error) {
      for (const id of containers) {
        try {
          return (await this.post("consult/kaliCont", { id })) as ApiSection;
        } catch {
          // try the next one
        }
      }
      throw error;
    }
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  run: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await run(items[index] as T);
    }
  });
  await Promise.all(workers);
  return results;
}

function printReport(
  reports: Report[],
  shared: { directory: string; missingTexts: string[] | undefined }[],
): void {
  const date = (text: LegifranceText) =>
    text.signedOn ?? (text.modifiedOn ? `modifié ${text.modifiedOn}` : "date inconnue");
  for (const report of reports) {
    const lines: string[] = [];
    if (report.error) lines.push(`  erreur : ${report.error}`);
    for (const text of report.newTexts) {
      lines.push(`  nouveau   ${date(text)}  ${text.id}  ${text.state}  [${text.group}] ${text.title}`);
    }
    for (const text of report.changedTexts) {
      lines.push(`  état      ${date(text)}  ${text.id}  ${text.state}  [${text.group}] ${text.title}`);
    }
    for (const id of report.missingTexts) {
      lines.push(`  absent    ${id} (cité, mais pas dans la liste des textes de la convention)`);
    }
    if (lines.length === 0) continue;
    const since = report.latestCitedDate ? `, dernier texte cité du ${report.latestCitedDate}` : "";
    console.log(`IDCC ${report.idcc} — ${report.title ?? report.directories.join(", ")}${since}`);
    for (const line of lines) console.log(line);
    console.log();
  }
  for (const { directory, missingTexts } of shared) {
    if (missingTexts === undefined) {
      console.log(`${directory} — non vérifié (une de ses conventions est en erreur)\n`);
    } else if (missingTexts.length > 0) {
      console.log(`${directory}`);
      for (const id of missingTexts) {
        console.log(`  absent    ${id} (cité, mais dans la liste d'aucune de ses conventions)`);
      }
      console.log();
    }
  }
  const withNews = reports.filter((report) => report.newTexts.length > 0).length;
  const errors = reports.filter((report) => report.error).length;
  console.log(
    `${reports.length} conventions vérifiées, ${withNews} avec de nouveaux textes` +
      (errors ? `, ${errors} en erreur` : "") +
      ".",
  );
}

/** A generic password of the macOS keychain, by service name; undefined elsewhere or when absent. */
function keychainSecret(service: string): string | undefined {
  if (process.platform !== "darwin") return undefined;
  try {
    return execFileSync("security", ["find-generic-password", "-s", service, "-w"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim() || undefined;
  } catch {
    return undefined;
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const flags = new Set(args.filter((arg) => arg.startsWith("--")));
  for (const flag of flags) {
    if (!["--sandbox", "--json", "--all"].includes(flag)) throw new Error(`unknown option ${flag}`);
  }
  const wanted = new Set(args.filter((arg) => !arg.startsWith("--")).map((idcc) => idcc.padStart(4, "0")));

  const PISTE_CLIENT_ID = process.env.PISTE_CLIENT_ID || keychainSecret("piste-client-id");
  const PISTE_CLIENT_SECRET = process.env.PISTE_CLIENT_SECRET || keychainSecret("piste-client-secret");
  if (!PISTE_CLIENT_ID || !PISTE_CLIENT_SECRET) {
    throw new Error(
      "set PISTE_CLIENT_ID and PISTE_CLIENT_SECRET, or store them in the macOS keychain as the services " +
        "piste-client-id and piste-client-secret (Légifrance API application on piste.gouv.fr)",
    );
  }
  const api = new Legifrance(
    flags.has("--sandbox") ? HOSTS.sandbox : HOSTS.production,
    PISTE_CLIENT_ID,
    PISTE_CLIENT_SECRET,
  );

  const agreements = readAgreements().filter((agreement) => wanted.size === 0 || wanted.has(agreement.idcc));
  const unknown = [...wanted].filter((idcc) => !agreements.some((agreement) => agreement.idcc === idcc));
  if (unknown.length > 0) throw new Error(`no agreement in rules/ for IDCC ${unknown.join(", ")}`);

  const listedByIdcc = new Map<string, Set<string>>();
  const reports = await mapWithConcurrency(agreements, 4, async (agreement): Promise<Report> => {
    try {
      const container = await api.container(String(Number(agreement.idcc)), agreement.containers);
      const texts = listTexts(container);
      listedByIdcc.set(agreement.idcc, new Set(texts.map((text) => text.id)));
      return {
        title: container.titre ?? container.title,
        ...compare(agreement, texts, { all: flags.has("--all") }),
      };
    } catch (error) {
      return {
        idcc: agreement.idcc,
        directories: agreement.directories,
        newTexts: [],
        changedTexts: [],
        missingTexts: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });

  const checked = new Set(agreements.map((agreement) => agreement.idcc));
  const shared = readSharedDirectories()
    .filter((directory) => directory.idccs.every((idcc) => checked.has(idcc)))
    .map((directory) => ({
      directory: directory.directory,
      missingTexts: missingSharedTexts(directory, listedByIdcc),
    }));

  if (flags.has("--json")) console.log(JSON.stringify({ agreements: reports, shared }, null, 2));
  else printReport(reports, shared);
  if (reports.some((report) => report.error)) process.exitCode = 1;
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

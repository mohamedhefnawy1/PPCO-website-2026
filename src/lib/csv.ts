import { readFileSync } from "node:fs";
import path from "node:path";

/** Minimal parser for the site's semicolon-separated CSV exports (supports quoted fields). */
export function readCsv(file: string): string[][] {
  const raw = readFileSync(path.join(process.cwd(), "src/data", file), "utf8").replace(/\r/g, "");
  return raw
    .split("\n")
    .filter((l) => l.trim())
    .map((line) => {
      const out: string[] = [];
      let cur = "";
      let q = false;
      for (const ch of line) {
        if (ch === '"') q = !q;
        else if (ch === ";" && !q) {
          out.push(cur);
          cur = "";
        } else cur += ch;
      }
      out.push(cur);
      return out.map((s) => s.trim());
    });
}

export type Project = { sn: string; name: string; scope: string; client: string };

export function readProjects(file: string): Project[] {
  const [, ...rows] = readCsv(file);
  return rows.map(([sn, name, scope, client]) => ({ sn, name, scope, client }));
}

/** The resource lists are published as two side-by-side column pairs; flatten them in reading order. */
export function readResourceList(file: string): { item: string; count: number }[] {
  const [, ...rows] = readCsv(file);
  const left = rows.map((r) => ({ item: r[0], count: Number(r[1]) }));
  const right = rows.filter((r) => r[2]).map((r) => ({ item: r[2], count: Number(r[3]) }));
  return [...left, ...right].filter((r) => r.item);
}

/**
 * Clients PPCO has worked for, taken from the three project lists and ordered by number of projects.
 * Generic labels from the lists ("City Residence RE", "Retail RE") are left out.
 */
export function pastClients(): string[] {
  const counts = new Map<string, number>();
  for (const f of ["civil-projects.csv", "mechanical-projects.csv", "electrical-projects.csv"]) {
    for (const p of readProjects(f)) {
      if (!p.client || / RE$/.test(p.client)) continue;
      counts.set(p.client, (counts.get(p.client) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([c]) => c);
}

export type LocationStats = {
  total: number;
  divisions: { id: string; label: string; count: number }[];
  clients: string[];
  sample: string[];
};

/** Projects from the three lists grouped by map location (see src/content/locations.ts). */
export function locationProjects(
  divisions: { id: string; label: string; csv: string }[],
  locs: { id: string; keywords: string[] }[],
  match: (name: string, loc: { keywords: string[] }) => boolean,
): Record<string, LocationStats> {
  const lists = divisions.map((d) => ({ ...d, projects: readProjects(d.csv) }));
  const out: Record<string, LocationStats> = {};
  for (const loc of locs) {
    const divs = lists
      .map((d) => ({ id: d.id, label: d.label, hits: d.projects.filter((p) => match(p.name, loc)) }))
      .filter((d) => d.hits.length);
    const all = divs.flatMap((d) => d.hits);
    out[loc.id] = {
      total: all.length,
      divisions: divs.map((d) => ({ id: d.id, label: d.label, count: d.hits.length })),
      clients: [...new Set(all.map((p) => p.client))],
      sample: all.slice(0, 3).map((p) => p.name),
    };
  }
  return out;
}

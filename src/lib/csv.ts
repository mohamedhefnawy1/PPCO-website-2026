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

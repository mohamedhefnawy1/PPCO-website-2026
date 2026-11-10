"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Photo from "./Photo";
import Counter from "./Counter";
import { tc } from "@/lib/text";
import type { Project } from "@/lib/csv";
import { locations, projectInLocation } from "@/content/locations";

type Division = {
  id: string;
  label: string;
  count: number;
  title: string;
  scope: string;
  image: string;
  projects: Project[];
};

type Row = Project & { division: string; divisionLabel: string; key: string };
type Sort = "sn" | "name" | "client" | "division";
type Filters = { division: string | null; scopes: string[]; clients: string[]; location: string | null; q: string; sort: Sort };

const EMPTY: Filters = { division: null, scopes: [], clients: [], location: null, q: "", sort: "sn" };
const SORTS: { id: Sort; label: string }[] = [
  { id: "sn", label: "Project number" },
  { id: "name", label: "Project name (A–Z)" },
  { id: "client", label: "Client (A–Z)" },
  { id: "division", label: "Division" },
];
const ease = [0.23, 1, 0.32, 1] as const;
const clean = (s: string) => s.replace(/^"|"$/g, "");

/** Read filters from the address bar: ?division=&scope=a,b&client=a,b&location=&q=&sort= */
function fromUrl(divisionIds: string[]): Filters {
  const q = new URLSearchParams(window.location.search);
  const list = (k: string) => (q.get(k) ? q.get(k)!.split(",").map((s) => s.trim()).filter(Boolean) : []);
  const d = q.get("division");
  const l = q.get("location");
  const sort = q.get("sort") as Sort | null;
  return {
    division: d && divisionIds.includes(d) ? d : null,
    scopes: list("scope"),
    clients: list("client"),
    location: l && locations.some((x) => x.id === l) ? l : null,
    q: q.get("q") ?? "",
    sort: sort && SORTS.some((s) => s.id === sort) ? sort : "sn",
  };
}

function toUrl(f: Filters) {
  const url = new URL(window.location.href);
  const set = (k: string, v: string | null) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
  set("division", f.division);
  set("scope", f.scopes.join(",") || null);
  set("client", f.clients.join(",") || null);
  set("location", f.location);
  set("q", f.q.trim() || null);
  set("sort", f.sort === "sn" ? null : f.sort);
  window.history.replaceState(window.history.state, "", url);
}

/** Whether a row passes the filters, optionally ignoring one facet (for that facet's counts). */
function matches(r: Row, f: Filters, ignore?: keyof Filters) {
  if (ignore !== "division" && f.division && r.division !== f.division) return false;
  if (ignore !== "scopes" && f.scopes.length && !f.scopes.includes(r.scope)) return false;
  if (ignore !== "clients" && f.clients.length && !f.clients.includes(r.client)) return false;
  if (ignore !== "location" && f.location) {
    const loc = locations.find((l) => l.id === f.location);
    if (loc && !projectInLocation(r.name, loc)) return false;
  }
  if (ignore !== "q" && f.q.trim()) {
    const needle = f.q.trim().toLowerCase();
    if (!`${r.name} ${r.scope} ${r.client} ${r.divisionLabel}`.toLowerCase().includes(needle)) return false;
  }
  return true;
}

/** Counts per value for one facet, with every other filter applied. */
function facet(rows: Row[], f: Filters, key: "scopes" | "clients", pick: (r: Row) => string) {
  const m = new Map<string, number>();
  rows.forEach((r) => m.set(pick(r), 0));
  rows.filter((r) => matches(r, f, key)).forEach((r) => m.set(pick(r), (m.get(pick(r)) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function Highlight({ text, q }: { text: string; q: string }) {
  const needle = q.trim();
  if (!needle) return <>{text}</>;
  const i = text.toLowerCase().indexOf(needle.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-green/25 text-inherit">{text.slice(i, i + needle.length)}</mark>
      {text.slice(i + needle.length)}
    </>
  );
}

export default function ProjectsExplorer({ divisions, numbersTitle }: { divisions: Division[]; numbersTitle: string }) {
  const rows: Row[] = useMemo(
    () =>
      divisions.flatMap((d) =>
        d.projects.map((p) => ({ ...p, name: clean(p.name), division: d.id, divisionLabel: d.label, key: `${d.id}-${p.sn}` })),
      ),
    [divisions],
  );
  const divisionIds = useMemo(() => divisions.map((d) => d.id), [divisions]);
  const [f, setF] = useState<Filters>(EMPTY);
  const [ready, setReady] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // The filter column can be taller than the screen. Rather than give it a scrollbar of its own, it
  // travels with the page: scrolling down moves it up until its last filter is on screen, where it
  // holds; scrolling up brings it back down until its top is under the header. One scroll, no trap.
  const filtersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = filtersRef.current;
    if (!el) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const GAP = 24;
    let lastY = window.scrollY;
    let top = 0;
    let started = false;
    const place = () => {
      if (!desktop.matches) return void el.style.removeProperty("top");
      const y = window.scrollY;
      // Where the column rests when it fits: just under the header (or the top edge while the header is hidden).
      const offset = getComputedStyle(document.documentElement).getPropertyValue("--header-offset").trim();
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
      const max = (offset.startsWith("0") ? 0 : headerH) + GAP;
      const min = Math.min(max, window.innerHeight - el.offsetHeight - GAP);
      top = started ? Math.min(max, Math.max(min, top - (y - lastY))) : max;
      started = true;
      lastY = y;
      el.style.top = `${top}px`;
    };
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place, { passive: true });
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
      ro.disconnect();
    };
  }, []);

  // Filters live in the URL so a filtered view can be shared, and links from the map land filtered.
  useEffect(() => {
    const read = () => setF(fromUrl(divisionIds));
    read();
    setReady(true);
    window.addEventListener("ppco:urlchange", read);
    return () => window.removeEventListener("ppco:urlchange", read);
  }, [divisionIds]);
  useEffect(() => {
    if (ready) toUrl(f);
  }, [f, ready]);

  const update = useCallback((patch: Partial<Filters>) => setF((x) => ({ ...x, ...patch })), []);
  const toggle = (key: "scopes" | "clients", v: string) =>
    setF((x) => ({ ...x, [key]: x[key].includes(v) ? x[key].filter((y) => y !== v) : [...x[key], v] }));

  const results = useMemo(() => {
    const list = rows.filter((r) => matches(r, f));
    const by = {
      sn: (a: Row, b: Row) => divisionIds.indexOf(a.division) - divisionIds.indexOf(b.division) || Number(a.sn) - Number(b.sn),
      name: (a: Row, b: Row) => a.name.localeCompare(b.name),
      client: (a: Row, b: Row) => a.client.localeCompare(b.client) || a.name.localeCompare(b.name),
      division: (a: Row, b: Row) => a.divisionLabel.localeCompare(b.divisionLabel) || Number(a.sn) - Number(b.sn),
    }[f.sort];
    return list.sort(by);
  }, [rows, f, divisionIds]);

  const divisionCounts = useMemo(() => {
    const base = rows.filter((r) => matches(r, f, "division"));
    return Object.fromEntries([["all", base.length], ...divisions.map((d) => [d.id, base.filter((r) => r.division === d.id).length])]);
  }, [rows, f, divisions]);
  const scopes = useMemo(() => facet(rows, f, "scopes", (r) => r.scope), [rows, f]);
  const clients = useMemo(() => facet(rows, f, "clients", (r) => r.client), [rows, f]);
  const locationCounts = useMemo(() => {
    const base = rows.filter((r) => matches(r, f, "location"));
    return locations
      .map((l) => ({ ...l, n: base.filter((r) => projectInLocation(r.name, l)).length }))
      .filter((l) => l.n > 0 || l.id === f.location);
  }, [rows, f]);

  const div = divisions.find((d) => d.id === f.division) ?? null;
  const loc = locations.find((l) => l.id === f.location) ?? null;
  const chips: { label: string; clear: () => void }[] = [
    ...(div ? [{ label: `Division: ${div.label}`, clear: () => update({ division: null }) }] : []),
    ...f.scopes.map((s) => ({ label: `Scope: ${s}`, clear: () => toggle("scopes", s) })),
    ...f.clients.map((c) => ({ label: `Client: ${c}`, clear: () => toggle("clients", c) })),
    ...(loc ? [{ label: `Location: ${loc.name}`, clear: () => update({ location: null }) }] : []),
    ...(f.q.trim() ? [{ label: `Search: “${f.q.trim()}”`, clear: () => update({ q: "" }) }] : []),
  ];
  const clearAll = () => setF((x) => ({ ...EMPTY, sort: x.sort }));
  const activeCount = chips.length - (f.q.trim() ? 1 : 0);

  return (
    <>
      {/* Project numbers, doubling as division filters */}
      <section className="section pb-0 md:pb-0">
        <div className="wrap">
          <h2 className="heading h2">{numbersTitle}</h2>
          <div role="group" aria-label="Filter by division" className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
            {divisions.map((d) => {
              const on = d.id === f.division;
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => update({ division: on ? null : d.id })}
                  className={`relative p-6 text-left transition-colors md:p-8 ${on ? "bg-white" : "bg-mist hover:bg-white"}`}
                >
                  {on && <motion.span layoutId="division-active" className="absolute inset-x-0 top-0 h-[3px] bg-ink" transition={{ duration: 0.3, ease }} />}
                  <span className={`heading block text-[clamp(2.5rem,4vw,3.75rem)] ${on || !f.division ? "text-ink" : "text-ink/60"}`}>
                    <Counter value={d.count} suffix="+" />
                  </span>
                  <span className="mt-2 flex items-center justify-between text-lg font-medium">
                    {d.label}
                    <span className="text-sm font-normal text-muted">{on ? "Showing" : "Show projects"}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="division-panel" className="section">
        <div className="wrap">
          {/* Division introduction when one is chosen */}
          <AnimatePresence mode="wait" initial={false}>
            {div && (
              <motion.div
                key={div.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease }}
                className="mb-14 grid gap-10 lg:grid-cols-12 lg:gap-8"
              >
                <div className="lg:col-span-5">
                  <h2 className="heading h2">{tc(div.title)}</h2>
                  <p className="lead mt-6 text-muted">{div.scope}</p>
                </div>
                <Photo src={div.image} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[16/9] w-full lg:col-span-6 lg:col-start-7" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-8 border-t border-line pt-8 lg:grid-cols-12 lg:gap-10">
            {/* Filters */}
            <div className="lg:col-span-3">
              <button
                type="button"
                aria-expanded={panelOpen}
                aria-controls="project-filters"
                onClick={() => setPanelOpen((o) => !o)}
                className="flex h-11 w-full items-center justify-between border border-line px-4 text-sm font-medium lg:hidden"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4" aria-hidden /> Filters
                  {activeCount > 0 && <span className="tabular grid min-w-5 place-items-center rounded bg-ink px-1.5 text-xs text-white">{activeCount}</span>}
                </span>
                <span className="text-muted">{panelOpen ? "Hide" : "Show"}</span>
              </button>

              <div id="project-filters" ref={filtersRef} className={`${panelOpen ? "mt-4 block" : "hidden"} space-y-8 lg:sticky lg:top-[calc(var(--header-offset)+24px)] lg:mt-0 lg:block`}>
                <fieldset>
                  <legend className="text-sm font-medium text-muted">Division</legend>
                  <div className="mt-3 space-y-1">
                    {[{ id: "all", label: "All divisions" }, ...divisions].map((d) => {
                      const on = d.id === "all" ? !f.division : f.division === d.id;
                      return (
                        <label
                          key={d.id}
                          className={`flex min-h-10 items-center justify-between gap-3 text-[0.95rem] ${divisionCounts[d.id] === 0 && !on ? "cursor-not-allowed text-faint" : "cursor-pointer"}`}
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="division"
                              checked={on}
                              disabled={divisionCounts[d.id] === 0 && !on}
                              onChange={() => update({ division: d.id === "all" ? null : d.id })}
                              className="size-4 accent-[#111111]"
                            />
                            {d.label}
                          </span>
                          <span className="tabular text-sm text-muted">{divisionCounts[d.id]}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <CheckGroup legend="Scope of work" options={scopes} selected={f.scopes} onToggle={(v) => toggle("scopes", v)} />
                <CheckGroup legend="Client" options={clients} selected={f.clients} onToggle={(v) => toggle("clients", v)} />

                <label className="block">
                  <span className="text-sm font-medium text-muted">Location</span>
                  <select
                    value={f.location ?? ""}
                    onChange={(e) => update({ location: e.target.value || null })}
                    className="mt-3 w-full cursor-pointer border border-line bg-white px-3 py-2.5 text-base outline-none transition-colors focus:border-ink"
                  >
                    <option value="">Any location</option>
                    {locationCounts.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.n})
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPanelOpen(false);
                      // Scroll once the panel has collapsed, so the results' position is final.
                      requestAnimationFrame(() =>
                        requestAnimationFrame(() => document.getElementById("project-results")?.scrollIntoView({ block: "start" })),
                      );
                    }}
                    className="btn btn-primary w-full justify-center lg:hidden"
                  >
                    Show {results.length} {results.length === 1 ? "project" : "projects"}
                  </button>
                  {chips.length > 0 && (
                    <button type="button" onClick={clearAll} className="link text-sm">
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            <div id="project-results" className="min-w-0 lg:col-span-9">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="relative block flex-1">
                  <span className="sr-only">Search projects</span>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
                  <input
                    type="search"
                    value={f.q}
                    onChange={(e) => update({ q: e.target.value })}
                    placeholder="Search projects, scopes or clients"
                    className="w-full border border-line bg-white py-3 pl-10 pr-10 text-base outline-none transition-colors focus:border-ink"
                  />
                  {f.q && (
                    <button type="button" onClick={() => update({ q: "" })} className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center text-muted hover:text-ink" aria-label="Clear search">
                      <X className="size-4" />
                    </button>
                  )}
                </label>
                <label className="flex items-center gap-3 text-sm text-muted">
                  Sort by
                  <select
                    value={f.sort}
                    onChange={(e) => update({ sort: e.target.value as Sort })}
                    className="cursor-pointer border border-line bg-white px-3 py-3 text-base text-ink outline-none transition-colors focus:border-ink"
                  >
                    {SORTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <p className="tabular mr-2 text-sm text-muted" aria-live="polite">
                  {results.length} of {rows.length} projects
                </p>
                {chips.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={c.clear}
                    aria-label={`Remove filter ${c.label}`}
                    className="flex items-center gap-1.5 border border-line bg-mist px-3 py-1.5 text-sm transition-colors hover:border-ink"
                  >
                    {c.label} <X className="size-3.5" aria-hidden />
                  </button>
                ))}
              </div>

              <div className="mt-4 overflow-x-auto border border-line" tabIndex={0} role="region" aria-label="Project results">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <caption className="sr-only">PPCO projects, {results.length} shown</caption>
                  <thead className="bg-mist text-sm text-muted">
                    <tr>
                      <th scope="col" className="w-16 px-5 py-3.5 font-medium">S/N</th>
                      <th scope="col" className="px-5 py-3.5 font-medium">Project Name</th>
                      {!div && <th scope="col" className="px-5 py-3.5 font-medium">Division</th>}
                      <th scope="col" className="px-5 py-3.5 font-medium">Scope</th>
                      <th scope="col" className="px-5 py-3.5 font-medium">Client</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((p, i) => (
                        <motion.tr
                          key={p.key}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.25, delay: Math.min(i, 10) * 0.015 }}
                          className="border-t border-line transition-colors hover:bg-mist/60"
                        >
                          <td className="tabular px-5 py-4 text-muted">{p.sn}</td>
                          <td className="px-5 py-4 font-medium">
                            <Highlight text={p.name} q={f.q} />
                          </td>
                          {!div && (
                            <td className="px-5 py-4">
                              <button type="button" onClick={() => update({ division: p.division })} className="text-left underline decoration-line underline-offset-4 hover:decoration-ink">
                                {p.divisionLabel}
                              </button>
                            </td>
                          )}
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => !f.scopes.includes(p.scope) && toggle("scopes", p.scope)}
                              className="inline-block whitespace-nowrap bg-ink/[0.07] px-2.5 py-1 text-sm transition-colors hover:bg-ink/[0.14]"
                              aria-label={`Filter by scope ${p.scope}`}
                            >
                              {p.scope}
                            </button>
                          </td>
                          <td className="px-5 py-4 text-muted">
                            <button
                              type="button"
                              onClick={() => !f.clients.includes(p.client) && toggle("clients", p.client)}
                              className="text-left hover:text-ink"
                              aria-label={`Filter by client ${p.client}`}
                            >
                              <Highlight text={p.client} q={f.q} />
                            </button>
                          </td>
                        </motion.tr>
                    ))}
                    {results.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-14 text-center">
                          <p className="font-medium">No projects match these filters.</p>
                          <p className="mt-1 text-sm text-muted">Remove a filter above, or start again.</p>
                          <button type="button" onClick={clearAll} className="btn btn-outline mt-5">
                            Clear all filters
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-muted">Tip: select a scope or client in the table to filter by it.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Checkbox list with live counts; values with no matches are left out, and long lists collapse. */
function CheckGroup({ legend, options, selected, onToggle }: { legend: string; options: [string, number][]; selected: string[]; onToggle: (v: string) => void }) {
  const [all, setAll] = useState(false);
  const LIMIT = 8;
  // Only offer values that still have matches (plus anything already ticked), so no choice leads to an empty list.
  const usable = options.filter(([v, n]) => n > 0 || selected.includes(v));
  const list = all ? usable : usable.slice(0, LIMIT);
  return (
    <fieldset>
      <legend className="text-sm font-medium text-muted">{legend}</legend>
      <div className="mt-3 space-y-1">
        {list.map(([v, n]) => {
          const on = selected.includes(v);
          return (
            <label key={v} className="flex min-h-10 cursor-pointer items-center justify-between gap-3 text-[0.95rem]">
              <span className="flex items-center gap-3">
                <input type="checkbox" checked={on} onChange={() => onToggle(v)} className="size-4 shrink-0 accent-[#111111]" />
                {v}
              </span>
              <span className="tabular text-sm text-muted">{n}</span>
            </label>
          );
        })}
      </div>
      {usable.length > LIMIT && (
        <button type="button" onClick={() => setAll((a) => !a)} aria-expanded={all} className="mt-2 text-sm font-medium underline underline-offset-4">
          {all ? "Show fewer" : `Show all ${usable.length}`}
        </button>
      )}
    </fieldset>
  );
}

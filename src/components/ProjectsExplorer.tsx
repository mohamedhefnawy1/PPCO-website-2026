"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Photo from "./Photo";
import Counter from "./Counter";
import { tc } from "@/lib/text";
import type { Project } from "@/lib/csv";

type Division = {
  id: string;
  label: string;
  count: number;
  title: string;
  scope: string;
  image: string;
  projects: Project[];
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProjectsExplorer({ divisions, numbersTitle }: { divisions: Division[]; numbersTitle: string }) {
  const [active, setActive] = useState(divisions[0].id);
  const [query, setQuery] = useState("");
  const [client, setClient] = useState<string | null>(null);
  const div = divisions.find((d) => d.id === active)!;

  const clients = useMemo(() => {
    const m = new Map<string, number>();
    div.projects.forEach((p) => m.set(p.client, (m.get(p.client) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [div]);

  const rows = div.projects.filter(
    (p) =>
      (!client || p.client === client) &&
      (!query || `${p.name} ${p.scope} ${p.client}`.toLowerCase().includes(query.toLowerCase())),
  );

  const select = (id: string) => {
    setActive(id);
    setClient(null);
    setQuery("");
  };

  return (
    <>
      {/* Project numbers, doubling as division tabs */}
      <section className="section pb-0 md:pb-0">
        <div className="wrap">
          <h2 className="heading h2">{numbersTitle}</h2>
          <div role="tablist" aria-label="Divisions" className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
            {divisions.map((d) => {
              const on = d.id === active;
              return (
                <button
                  key={d.id}
                  role="tab"
                  aria-selected={on}
                  aria-controls="division-panel"
                  onClick={() => select(d.id)}
                  className={`relative p-6 text-left transition-colors md:p-8 ${on ? "bg-white" : "bg-mist hover:bg-white"}`}
                >
                  {on && <motion.span layoutId="division-active" className="absolute inset-x-0 top-0 h-[3px] bg-indigo" transition={{ duration: 0.35, ease }} />}
                  <span className={`heading block text-[clamp(2.5rem,4vw,3.75rem)] ${on ? "text-indigo" : "text-ink/70"}`}>
                    <Counter value={d.count} suffix="+" />
                  </span>
                  <span className="mt-2 block text-lg font-medium">{d.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="division-panel" role="tabpanel" className="section">
        <div className="wrap">
          <AnimatePresence mode="wait">
            <motion.div key={div.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-5">
                  <h2 className="heading h2">{tc(div.title)}</h2>
                  <p className="lead mt-6 text-muted">{div.scope}</p>
                </div>
                <Photo src={div.image} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[16/9] w-full lg:col-span-6 lg:col-start-7" />
              </div>

              {/* Filters */}
              <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2" aria-label="Filter by client">
                  <Chip on={!client} onClick={() => setClient(null)}>
                    All <span className="tabular opacity-60">{div.projects.length}</span>
                  </Chip>
                  {clients.map(([name, n]) => (
                    <Chip key={name} on={client === name} onClick={() => setClient(client === name ? null : name)}>
                      {name} <span className="tabular opacity-60">{n}</span>
                    </Chip>
                  ))}
                </div>
                <label className="relative block lg:w-80">
                  <span className="sr-only">Search projects</span>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search projects"
                    className="w-full border border-line bg-white py-3 pl-10 pr-10 outline-none transition-colors focus:border-indigo"
                  />
                  {query && (
                    <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-muted" aria-label="Clear search">
                      <X className="size-4" />
                    </button>
                  )}
                </label>
              </div>

              {/* Table */}
              <div className="mt-6 overflow-x-auto border border-line">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead className="bg-mist text-sm text-muted">
                    <tr>
                      <th scope="col" className="w-16 px-5 py-3.5 font-medium">S/N</th>
                      <th scope="col" className="px-5 py-3.5 font-medium">Project Name</th>
                      <th scope="col" className="px-5 py-3.5 font-medium">Scope</th>
                      <th scope="col" className="px-5 py-3.5 font-medium">Client</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((p) => (
                      <tr key={p.sn} className="border-t border-line transition-colors hover:bg-mist/60">
                        <td className="tabular px-5 py-4 text-muted">{p.sn}</td>
                        <td className="px-5 py-4 font-medium">{p.name}</td>
                        <td className="px-5 py-4">
                          <span className="inline-block whitespace-nowrap bg-indigo/[0.07] px-2.5 py-1 text-sm text-indigo">{p.scope}</span>
                        </td>
                        <td className="px-5 py-4 text-muted">{p.client}</td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-5 py-10 text-center text-muted">
                          No projects match “{query}”. Clear the search or choose another client.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="tabular mt-3 text-sm text-muted" aria-live="polite">
                Showing {rows.length} of {div.projects.length}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`flex items-center gap-2 border px-3.5 py-2 text-sm transition-colors ${
        on ? "border-indigo bg-indigo text-white" : "border-line bg-white text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

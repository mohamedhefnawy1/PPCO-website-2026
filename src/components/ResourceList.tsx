"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import Counter from "./Counter";
import { tc } from "@/lib/text";

type Item = { item: string; count: number };

/** Searchable, sortable list for the equipment and manpower registers. */
export default function ResourceList({
  items,
  total,
  totalLabel,
  suffix = "",
  itemLabel,
  searchLabel,
  columns,
}: {
  items: Item[];
  total: number;
  totalLabel: string;
  suffix?: string;
  itemLabel: string;
  searchLabel: string;
  columns: [string, string];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"list" | "count" | "az">("list");
  const max = Math.max(...items.map((i) => i.count));

  const rows = useMemo(() => {
    let r = items.filter((i) => i.item.toLowerCase().includes(query.toLowerCase()));
    if (sort === "count") r = [...r].sort((a, b) => b.count - a.count);
    if (sort === "az") r = [...r].sort((a, b) => a.item.localeCompare(b.item));
    return r;
  }, [items, query, sort]);
  const shown = rows.reduce((n, r) => n + r.count, 0);

  return (
    <section className="section">
      <div className="wrap">
        <div className="grid gap-8 border-b border-line pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <p className="text-sm font-medium text-muted">{tc(totalLabel)}</p>
            <p className="heading mt-2 text-[clamp(3rem,6vw,5.5rem)] text-indigo">
              <Counter value={total} suffix={suffix} />
            </p>
            <p className="mt-2 text-muted">
              {items.length} {itemLabel}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-7 lg:justify-end">
            <label className="relative block sm:w-80">
              <span className="sr-only">{searchLabel}</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchLabel}
                className="w-full border border-line bg-white py-3 pl-10 pr-10 outline-none transition-colors focus:border-indigo"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-muted" aria-label="Clear search">
                  <X className="size-4" />
                </button>
              )}
            </label>
            <div className="flex border border-line" role="group" aria-label="Sort">
              {(
                [
                  ["list", "Default"],
                  ["count", "Most available"],
                  ["az", "A–Z"],
                ] as const
              ).map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={sort === k}
                  onClick={() => setSort(k)}
                  className={`flex-1 whitespace-nowrap px-4 py-3 text-sm transition-colors ${sort === k ? "bg-indigo text-white" : "bg-white hover:bg-mist"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 grid md:grid-cols-2 md:gap-x-12">
          {[0, 1].map((k) => (
            <div key={k} className={`justify-between py-3 text-sm text-muted ${k === 0 ? "flex" : "hidden md:flex"}`}>
              <span>{columns[0]}</span>
              <span>{columns[1]}</span>
            </div>
          ))}
          {rows.map((r) => (
            <div key={r.item} className="border-t border-line py-3.5">
              <div className="flex items-baseline justify-between gap-6">
                <span>{r.item}</span>
                <span className="tabular font-medium">{r.count.toLocaleString("en-US")}</span>
              </div>
              <div className="mt-2 h-1 bg-mist" aria-hidden>
                <div className="h-full bg-indigo/70" style={{ width: `${Math.max(2, (r.count / max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
        {rows.length === 0 && <p className="py-10 text-center text-muted">Nothing matches “{query}”. Try a shorter search.</p>}
        <p className="tabular mt-6 border-t border-line pt-4 text-sm text-muted" aria-live="polite">
          {query ? `Showing ${rows.length} of ${items.length}, ${shown.toLocaleString("en-US")} in total` : `${items.length} ${itemLabel}`}
        </p>
      </div>
    </section>
  );
}

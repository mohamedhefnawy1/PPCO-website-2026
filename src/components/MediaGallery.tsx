"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Photo from "./Photo";
import Lightbox from "./Lightbox";
import { tc } from "@/lib/text";

const PAGE = 24;

/** Filterable project-site gallery, same categories as the original Media Center. */
export default function MediaGallery({ sites }: { sites: { site: string; photos: string[] }[] }) {
  const [filter, setFilter] = useState<string>("All");
  const [limit, setLimit] = useState(PAGE);
  const [index, setIndex] = useState<number | null>(null);

  const all = sites.flatMap((s) => s.photos.map((src) => ({ src, site: s.site })));
  const items = filter === "All" ? all : all.filter((p) => p.site === filter);
  const visible = items.slice(0, limit);

  const choose = (f: string) => {
    setFilter(f);
    setLimit(PAGE);
  };

  return (
    <>
      <div className="sticky top-20 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="wrap">
          <div role="tablist" aria-label="Filter by site" className="-mx-1 flex gap-1 overflow-x-auto py-3">
            {["All", ...sites.map((s) => s.site)].map((f) => {
              const n = f === "All" ? all.length : sites.find((s) => s.site === f)!.photos.length;
              const on = f === filter;
              return (
                <button
                  key={f}
                  role="tab"
                  aria-selected={on}
                  onClick={() => choose(f)}
                  className={`relative shrink-0 px-3.5 py-2 text-sm font-medium transition-colors ${on ? "text-white" : "text-muted hover:text-ink"}`}
                >
                  {on && <motion.span layoutId="media-filter" className="absolute inset-0 bg-indigo" transition={{ duration: 0.3 }} />}
                  <span className="relative">
                    {f === "All" ? "All" : tc(f)} <span className="tabular opacity-60">{n}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="section pt-10 md:pt-12">
        <div className="wrap">
          <motion.ul layout className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence initial={false}>
              {visible.map((p, i) => (
                <motion.li
                  key={p.src}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <button type="button" onClick={() => setIndex(i)} className="group relative block w-full" aria-label={`Open photo ${i + 1}, ${tc(p.site)}`}>
                    <Photo src={p.src} alt="" sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" className="aspect-[4/3] w-full" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 to-transparent px-3 pb-2.5 pt-8 text-left text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {tc(p.site)}
                    </span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          <div className="mt-10 flex flex-col items-center gap-3">
            <p className="tabular text-sm text-muted">
              Showing {visible.length} of {items.length}
            </p>
            {visible.length < items.length && (
              <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="btn btn-outline">
                Show more photos
              </button>
            )}
          </div>
        </div>
      </section>

      <Lightbox
        images={items.map((p) => p.src)}
        index={index}
        onChange={setIndex}
        label={index !== null ? tc(items[index]?.site ?? "") : undefined}
      />
    </>
  );
}

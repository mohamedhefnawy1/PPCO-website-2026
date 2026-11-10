"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, MapPin } from "lucide-react";
import { MAP, leaderPath, locationKinds, locations, type Location, type LocationKind } from "@/content/locations";
import { COUNTRY_LABELS, REGION, SEA_LABELS } from "@/content/map-geo";
import { Reveal, RevealText } from "../motion/primitives";
import type { LocationStats } from "@/lib/csv";

const ease = [0.23, 1, 0.32, 1] as const;
const KINDS: LocationKind[] = ["hq", "regional", "site", "project"];
const HQ = locations.find((l) => l.kind === "hq")!;

/** Position helpers: SVG user units → percentages of the map box, so HTML controls line up with the drawing. */
const px = (x: number) => `${((x - MAP.minX) / MAP.width) * 100}%`;
const py = (y: number) => `${((y - MAP.minY) / MAP.height) * 100}%`;

/** Curved route from the head office to a location, bowing away from the straight line. */
function routePath(to: Location) {
  const dx = to.x - HQ.x;
  const dy = to.y - HQ.y;
  const len = Math.hypot(dx, dy) || 1;
  const bow = Math.min(len * 0.22, 120);
  const cx = (HQ.x + to.x) / 2 + (-dy / len) * bow;
  const cy = (HQ.y + to.y) / 2 + (dx / len) * bow;
  return `M${HQ.x} ${HQ.y} Q${cx} ${cy} ${to.x} ${to.y}`;
}

function Swatch({ kind, className = "" }: { kind: LocationKind; className?: string }) {
  const style = {
    hq: "size-3 bg-ink ring-2 ring-ink/20",
    regional: "size-2.5 bg-ink",
    site: "size-2.5 bg-green",
    project: "size-2.5 border-2 border-ink bg-white",
  }[kind];
  return <span aria-hidden className={`inline-block shrink-0 rounded-full ${style} ${className}`} />;
}

/**
 * Interactive map of PPCO's head office, regional offices, site offices and project locations.
 * The whole section is the map: Saudi Arabia and the countries around it run edge to edge behind the
 * heading and the details panel, which is a sheet of glass laid over it.
 * Pick a location (label, dot, list or arrows) to see its role and the projects listed there,
 * with links into the Projects page filtered to that location.
 */
export default function LocationsMap({
  stats,
  eyebrow,
  title,
  body,
}: {
  stats: Record<string, LocationStats>;
  eyebrow: string;
  title: string;
  body: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const shown = reduce || inView;

  const [selectedId, setSelectedId] = useState(HQ.id);
  const [hidden, setHidden] = useState<Set<LocationKind>>(new Set());
  const visible = useMemo(() => locations.filter((l) => !hidden.has(l.kind)), [hidden]);
  const selected = locations.find((l) => l.id === selectedId)!;
  const order = visible.length ? visible : locations;
  const step = (dir: 1 | -1) => {
    const i = order.findIndex((l) => l.id === selectedId);
    setSelectedId(order[(i + dir + order.length) % order.length].id);
  };
  const toggleKind = (k: LocationKind) => {
    const next = new Set(hidden);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    if (next.size === KINDS.length) return; // keep at least one category on
    setHidden(next);
    if (next.has(selected.kind)) setSelectedId(locations.find((l) => !next.has(l.kind))!.id);
  };

  const s = stats[selected.id];
  const appear = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0 }, animate: shown ? { opacity: 1 } : { opacity: 0 }, transition: { duration: 0.5, ease, delay } };

  return (
    <section id="locations" className="relative isolate scroll-mt-20 overflow-hidden bg-white">
      {/* The map fades into the white above it and into the grey of the section below */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-[1] h-40 bg-gradient-to-b from-white via-white/80 to-transparent md:h-56" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-[1] h-40 bg-gradient-to-t from-mist via-mist/80 to-transparent md:h-56" />
     <div className="wrap relative py-16 md:py-24">
      <div className="relative z-10 max-w-xl">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <RevealText text={title} className="heading h2 mt-4" />
        <Reveal delay={0.1}>
          <p className="mt-4 text-muted">{body}</p>
        </Reveal>
      </div>

    <div ref={ref} className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-8">
      {/* Map */}
      <div className="min-w-0 lg:col-span-8">
        {/* Legend doubles as a filter */}
        <div role="group" aria-label="Show on the map" className="relative z-10 flex flex-wrap gap-2">
          {KINDS.map((k) => {
            const on = !hidden.has(k);
            return (
              <button
                key={k}
                type="button"
                aria-pressed={on}
                onClick={() => toggleKind(k)}
                className={`inline-flex h-10 items-center gap-2 rounded border px-4 text-sm font-medium transition-[background,border-color,color,opacity] duration-200 ${
                  on ? "border-line bg-white text-ink shadow-[0_2px_8px_rgb(0_0_0/0.06)] hover:border-ink" : "border-dashed border-ink/25 bg-transparent text-muted opacity-70 hover:opacity-100"
                }`}
              >
                <Swatch kind={k} className={on ? "" : "opacity-40"} />
                {locationKinds[k].label}
              </button>
            );
          })}
        </div>

        <div className="relative -ml-[14%] mt-6 w-[118%] select-none md:ml-0 md:w-full" style={{ aspectRatio: `${MAP.width} / ${MAP.height}` }}>
          {/* The region, drawn once as a static file and laid out in the map's own coordinates so it
              runs past the map box to the edges of the section. */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -z-10"
            style={{ left: px(REGION.x), top: py(REGION.y), width: `${(REGION.width / MAP.width) * 100}%`, height: `${(REGION.height / MAP.height) * 100}%` }}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: 0.9, ease }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={REGION.src} alt="" className="h-full w-full" decoding="async" loading="lazy" />
            {/* Names above the map box would sit under the heading, so they are left out */}
            {COUNTRY_LABELS.filter((c) => c.y > MAP.minY + 20).map((c) => (
              <span
                key={c.name}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-medium uppercase ${
                  c.name === "Saudi Arabia" ? "text-[10px] tracking-[0.3em] text-ink/30 md:text-sm" : "text-[9px] tracking-[0.16em] text-ink/35 md:text-[11px]"
                }`}
                style={{ left: `${((c.x - REGION.x) / REGION.width) * 100}%`, top: `${((c.y - REGION.y) / REGION.height) * 100}%` }}
              >
                {c.name}
              </span>
            ))}
            {SEA_LABELS.filter((c) => c.y > MAP.minY + 20).map((c) => (
              <span
                key={c.name}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] italic tracking-[0.08em] text-ink/35 md:text-xs"
                style={{ left: `${((c.x - REGION.x) / REGION.width) * 100}%`, top: `${((c.y - REGION.y) / REGION.height) * 100}%` }}
              >
                {c.name}
              </span>
            ))}
          </motion.div>
          <svg viewBox={MAP.viewBox} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            {/* Leader lines to labels set away from their dots */}
            {locations.map((l) =>
              l.label.leader ? (
                <motion.path
                  key={l.id}
                  d={leaderPath(l)}
                  fill="none"
                  stroke={l.id === selectedId ? "#111111" : "#aab1b0"}
                  strokeWidth={1.25}
                  className={l.id === selectedId || l.kind === "hq" ? "" : "max-md:hidden"}
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: shown ? 1 : 0, opacity: hidden.has(l.kind) ? 0.15 : 1 }}
                  transition={{ pathLength: { duration: 0.6, ease, delay: 0.5 }, opacity: { duration: 0.2 } }}
                />
              ) : null,
            )}
            {/* Route from the head office to the selected location */}
            <AnimatePresence>
              {selected.id !== HQ.id && (
                <motion.path
                  key={selected.id}
                  d={routePath(selected)}
                  fill="none"
                  stroke="#2fb61d"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  initial={reduce ? { opacity: 1 } : { pathLength: 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.6, ease }}
                />
              )}
            </AnimatePresence>
          </svg>

          {/* Dots (pointer targets; keyboard users use the labels or the list) */}
          {locations.map((l, i) => {
            const off = hidden.has(l.kind);
            const on = l.id === selectedId;
            return (
              <motion.div
                key={l.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: px(l.x), top: py(l.y), zIndex: on ? 3 : l.kind === "hq" ? 2 : 1 }}
                {...appear(0.35 + i * 0.03)}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  disabled={off}
                  onClick={() => setSelectedId(l.id)}
                  className={`group grid size-6 place-items-center transition-opacity duration-200 ${off ? "pointer-events-none opacity-15" : ""}`}
                >
                  <span
                    className={`relative block rounded-full transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-125 ${
                      {
                        hq: "size-3.5 bg-ink ring-[3px] ring-white",
                        regional: "size-3 bg-ink ring-2 ring-white",
                        site: "size-3 bg-green ring-2 ring-white",
                        project: "size-2.5 border-2 border-ink bg-white",
                      }[l.kind]
                    } ${on ? "scale-125" : ""}`}
                  />
                  {on && !reduce && (
                    <motion.span
                      key={`ring-${l.id}`}
                      className="pointer-events-none absolute inset-0 rounded-full border-2 border-ink"
                      initial={{ opacity: 0.6, transform: "scale(0.6)" }}
                      animate={{ opacity: 0, transform: "scale(1.8)" }}
                      transition={{ duration: 0.8, ease }}
                    />
                  )}
                </button>
              </motion.div>
            );
          })}

          {/* Labels: the keyboard-accessible controls on larger screens */}
          {locations.map((l, i) => {
            const off = hidden.has(l.kind);
            const on = l.id === selectedId;
            const shift = { start: "0%", middle: "-50%", end: "-100%" }[l.label.anchor];
            return (
              <motion.button
                key={l.id}
                type="button"
                disabled={off}
                aria-pressed={on}
                aria-label={`${l.name}, ${locationKinds[l.kind].label}`}
                onClick={() => setSelectedId(l.id)}
                className={`absolute whitespace-nowrap rounded-sm px-1 py-0.5 leading-none [text-shadow:0_0_3px_#fff,0_0_6px_#fff] transition-[color,opacity] duration-200 ${
                  on ? "text-ink" : l.kind === "project" ? "text-muted hover:text-ink" : "text-ink/80 hover:text-ink"
                } ${l.kind === "hq" ? "text-base font-semibold lg:text-lg" : l.kind === "project" ? "text-xs font-medium" : "text-sm font-medium"} ${
                  off ? "pointer-events-none opacity-15" : ""
                } ${on ? "underline decoration-green decoration-2 underline-offset-4" : ""} ${on || l.kind === "hq" ? "block" : "hidden md:block"}`}
                style={{ left: px(l.label.x), top: py(l.label.y), transform: `translate(${shift}, -50%)` }}
                {...appear(0.55 + i * 0.03)}
              >
                {l.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Details */}
      <div className="min-w-0 lg:col-span-4" role="region" aria-label="Location details">
        <div className="glass-light p-6 md:p-8 lg:sticky lg:top-[calc(var(--header-offset)+24px)] lg:transition-[top] lg:duration-500">
          <label className="block">
            <span className="text-sm font-medium text-ink/70">Location</span>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mt-2 w-full cursor-pointer appearance-none rounded border border-ink/15 bg-white/70 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M4 6l4 4 4-4%22 fill=%22none%22 stroke=%22%23111%22 stroke-width=%221.5%22/></svg>')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat py-3 pl-3 pr-10 text-base outline-none transition-colors focus:border-ink"
            >
              {KINDS.filter((k) => !hidden.has(k)).map((k) => (
                <optgroup key={k} label={locationKinds[k].label}>
                  {locations
                    .filter((l) => l.kind === k)
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>

          <div aria-live="polite" className="mt-6 min-h-[300px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selected.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)", transitionEnd: { transform: "none" } }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.25, ease }}
              >
                <p className="flex items-center gap-2 text-sm font-medium text-muted">
                  <Swatch kind={selected.kind} /> {locationKinds[selected.kind].label}
                </p>
                <h3 className="heading mt-3 text-3xl">{selected.name}</h3>
                <p className="mt-3 text-muted">{locationKinds[selected.kind].blurb}</p>

                {selected.office && (
                  <ul className="mt-5 space-y-2 text-sm">
                    <li className="flex gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>{selected.office.address}</span>
                    </li>
                    {selected.office.extra && (
                      <li className="flex gap-3">
                        <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
                        <span>{selected.office.extra}</span>
                      </li>
                    )}
                  </ul>
                )}

                {s.total > 0 ? (
                  <div className="mt-6 border-t border-ink/10 pt-5">
                    <p className="text-sm text-muted">
                      <span className="tabular heading text-2xl text-ink">{s.total}</span> listed {s.total === 1 ? "project" : "projects"}
                      {s.clients.length > 0 && <> for {s.clients.join(", ")}</>}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {s.sample.map((p) => (
                        <li key={p} className="border-l-2 border-ink/15 pl-3">
                          {p.replace(/^"|"$/g, "")}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-5 flex flex-col gap-2">
                      {s.divisions.map((d) => (
                        <li key={d.id}>
                          <Link href={`/projects/?division=${d.id}&location=${selected.id}#division-panel`} className="link">
                            View {d.count} {d.label.toLowerCase()} {d.count === 1 ? "project" : "projects"} <ArrowRight className="size-4" aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-6 border-t border-ink/10 pt-5">
                    <p className="text-sm text-muted">
                      {selected.office ? "Visit or contact this office for enquiries in the region." : "This location’s projects are not in the published project lists yet."}
                    </p>
                    <Link href={selected.office ? "/contact" : "/projects"} className="link mt-3">
                      {selected.office ? "Contact" : "All projects"} <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5">
            <button type="button" onClick={() => step(-1)} className="inline-flex h-10 items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink">
              <ArrowLeft className="size-4" aria-hidden /> Previous
            </button>
            <span className="tabular text-sm text-muted">
              {Math.max(1, order.findIndex((l) => l.id === selectedId) + 1)} / {order.length}
            </span>
            <button type="button" onClick={() => step(1)} className="inline-flex h-10 items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink">
              Next <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
     </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Photo from "../Photo";
import { ease } from "../motion/primitives";
import { home } from "@/content/site";
import { tc } from "@/lib/text";

/** Expanding image panels: hover (or tap) a discipline to open it. */
export default function Disciplines() {
  const items = home.disciplines.items;
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3 lg:h-[600px] lg:flex-row">
      {items.map((d, i) => {
        const on = i === active;
        return (
          <motion.div
            key={d.title}
            layout
            transition={{ layout: { duration: 0.7, ease } }}
            onMouseEnter={() => setActive(i)}
            className={`group relative min-h-[88px] overflow-hidden rounded-3xl text-white lg:rounded-[2rem] ${on ? "h-[440px] lg:h-auto lg:flex-[3.4]" : "h-[88px] lg:h-auto lg:flex-1"}`}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ scale: on ? 1 : 1.05 }}
              transition={{ duration: 1.2, ease }}
            >
              <Photo src={d.image} alt="" sizes="(min-width: 1024px) 55vw, 100vw" className="h-full w-full" />
            </motion.div>
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-night"
              animate={{ opacity: on ? 0.12 : 0.55 }}
              transition={{ duration: 0.6 }}
            />

            {/* The panel's control: covers the panel; the open panel's link sits above it */}
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-expanded={on}
              aria-controls={`discipline-${i}`}
              aria-label={tc(d.title)}
              className={`absolute inset-0 z-0 rounded-[inherit] ${on ? "cursor-default" : "cursor-pointer"} focus-visible:outline-offset-[-4px]`}
            />

            {/* Collapsed label, on a small piece of glass */}
            <AnimatePresence>
              {!on && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  aria-hidden
                  className="glass pointer-events-none absolute bottom-4 left-4 !rounded-full px-5 py-2.5 text-lg font-medium leading-none lg:bottom-5 lg:left-1/2 lg:-translate-x-1/2 lg:px-3 lg:py-5 lg:[writing-mode:vertical-rl] lg:rotate-180"
                >
                  {tc(d.title)}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Expanded content: a sheet of glass along the bottom of the photo */}
            <AnimatePresence>
              {on && (
                <motion.div
                  key="open"
                  id={`discipline-${i}`}
                  className="glass pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-5 p-5 md:inset-x-5 md:bottom-5 md:p-7"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.5, ease, delay: 0.25 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <div className="min-w-0">
                    <h3 className="heading text-[clamp(1.75rem,2.6vw,2.75rem)] leading-none">{tc(d.title)}</h3>
                    <p className="mt-3 max-w-[44ch] text-white/90">{d.text}</p>
                  </div>
                  <Link
                    href={d.href}
                    className="btn-glass pointer-events-auto grid size-12 shrink-0 place-items-center rounded-full transition-[background,border-color] duration-200 md:size-14"
                    aria-label={`${tc(d.title)}: services`}
                  >
                    <ArrowUpRight className="size-5" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

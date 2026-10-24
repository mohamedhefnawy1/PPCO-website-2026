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
    <div className="flex flex-col gap-2 lg:h-[620px] lg:flex-row">
      {items.map((d, i) => {
        const on = i === active;
        return (
          <motion.div
            key={d.title}
            layout
            transition={{ layout: { duration: 0.7, ease } }}
            onMouseEnter={() => setActive(i)}
            className={`group relative min-h-[96px] overflow-hidden text-white ${on ? "h-[440px] lg:h-auto lg:flex-[3.2]" : "h-[96px] lg:h-auto lg:flex-1"}`}
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
              animate={{ opacity: on ? 0.35 : 0.62 }}
              transition={{ duration: 0.6 }}
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.85))]" />

            {/* The panel's control: covers the panel; the open panel's link sits above it */}
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-expanded={on}
              aria-controls={`discipline-${i}`}
              aria-label={tc(d.title)}
              className={`absolute inset-0 z-0 ${on ? "cursor-default" : "cursor-pointer"} focus-visible:outline-offset-[-4px]`}
            />

            {/* Collapsed label */}
            <AnimatePresence>
              {!on && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  aria-hidden
                  className="pointer-events-none heading absolute bottom-6 left-6 text-2xl lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 lg:[writing-mode:vertical-rl] lg:rotate-180"
                >
                  {tc(d.title)}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Expanded content */}
            <AnimatePresence>
              {on && (
                <motion.div
                  key="open"
                  id={`discipline-${i}`}
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col gap-5 p-6 md:p-10 lg:flex-row lg:items-end lg:justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.5, ease, delay: 0.25 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <div>
                    <h3 className="heading text-[clamp(2.25rem,4vw,4rem)] leading-none">{tc(d.title)}</h3>
                    <p className="mt-4 max-w-[38ch] text-white/85">{d.text}</p>
                  </div>
                  <Link
                    href={d.href}
                    className="pointer-events-auto grid size-14 shrink-0 place-items-center rounded-full bg-white text-ink transition-colors duration-200 hover:bg-mist"
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

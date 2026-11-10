"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Photo from "../Photo";
import { home, up } from "@/content/site";

// Photos from the PPCO site that illustrate each service line (same order as home.services.items).
const images = [
  up("2024/05/WhatsApp-Image-2024-01-08-at-1.57.34-PM.jpeg"),
  up("2025/12/2761.jpg"),
  up("2025/11/heavy-machinery-used-construction-industry-engineering-Large.jpeg"),
  up("2026/02/1-69-Medium.jpeg"),
  up("2024/05/Picture1.jpg"),
  up("2025/12/1141.jpg"),
];

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The six service lines.
 * Desktop: a pinned photo on the left, with the service's description on a sheet of glass inside it;
 * the list on the right carries only the names, and hovering or focusing a name changes the photo.
 * Touch and small screens: a row of cards to swipe through, each with its photo and glass caption.
 */
export default function ServicesList() {
  const items = home.services.items;
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <>
      {/* Desktop */}
      <div className="hidden gap-8 lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <div className="sticky top-[calc(var(--header-offset)+32px)] transition-[top] duration-500">
            <div className="frame relative aspect-[5/4] bg-mist">
              {/* All photos stay mounted (and loaded); the active one crossfades in */}
              {images.map((src, i) => (
                <div
                  key={src}
                  aria-hidden
                  className={`absolute inset-0 transition-[opacity,transform] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    i === active ? "z-[1] scale-100 opacity-100 duration-500" : `opacity-0 duration-300 ${reduce ? "" : "scale-[1.04]"}`
                  }`}
                >
                  <Photo src={src} alt="" sizes="(min-width: 1024px) 50vw, 1px" className="h-full w-full" />
                </div>
              ))}
              <div className="glass absolute inset-x-4 bottom-4 z-[2] flex items-end justify-between gap-6 p-6 xl:inset-x-5 xl:bottom-5 xl:p-7">
                <div className="min-w-0">
                  <p className="tabular text-sm text-white/75">
                    {num(active)} / {num(items.length - 1)}
                  </p>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={active}
                      className="mt-2 max-w-[30ch] text-xl leading-snug xl:text-2xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      {items[active].text}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <Link href="/services" aria-label="All services" className="btn-glass grid size-12 shrink-0 place-items-center rounded-full transition-[background,border-color] duration-200">
                  <ArrowUpRight className="size-5" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <ul className="self-center border-t border-line lg:col-span-6">
          {items.map((s, i) => {
            const on = i === active;
            return (
              <li key={s.title} className="border-b border-line">
                <Link
                  href="/services"
                  aria-describedby={`service-text-${i}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-center gap-6 py-6 xl:py-7"
                >
                  <span className={`tabular w-7 text-sm transition-colors duration-200 ${on ? "text-green-deep" : "text-faint"}`}>{num(i)}</span>
                  <span className={`heading min-w-0 flex-1 text-2xl transition-colors duration-200 xl:text-[1.75rem] ${on ? "text-ink" : "text-ink/45"} group-hover:text-ink`}>
                    {s.title}
                  </span>
                  {/* The description is shown on the photo; this copy is for screen readers */}
                  <span id={`service-text-${i}`} className="sr-only">
                    {s.text}
                  </span>
                  <span
                    aria-hidden
                    className={`grid size-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color,opacity] duration-200 ${
                      on ? "border-ink bg-ink text-white" : "border-line text-ink opacity-0"
                    } group-hover:border-ink group-hover:bg-ink group-hover:text-white group-hover:opacity-100`}
                  >
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Phones and tablets: swipeable cards */}
      <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:-mx-8 md:px-8 lg:hidden [&::-webkit-scrollbar]:hidden">
        {items.map((s, i) => (
          <li key={s.title} className="w-[82%] shrink-0 snap-center sm:w-[56%]">
            <Link href="/services" className="group block">
              <div className="frame relative aspect-[4/5]">
                <Photo src={images[i]} alt="" sizes="(min-width: 640px) 56vw, 82vw" className="h-full w-full" />
                <div className="glass absolute inset-x-3 bottom-3 p-5">
                  <p className="tabular text-xs text-white/75">
                    {num(i)} / {num(items.length - 1)}
                  </p>
                  <p className="mt-1.5 text-base leading-snug">{s.text}</p>
                </div>
              </div>
              <span className="mt-4 flex items-center justify-between gap-4">
                <span className="heading text-xl">{s.title}</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

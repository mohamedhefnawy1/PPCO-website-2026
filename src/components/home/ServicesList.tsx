"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

/**
 * Service rows with a photo of the service.
 * Desktop: a pinned photo beside the list changes to the row being hovered or focused.
 * Touch and small screens: each row carries its own thumbnail instead (no hover there).
 */
export default function ServicesList() {
  const items = home.services.items;
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <ul className="border-t border-line lg:col-span-7">
        {items.map((s, i) => {
          const on = i === active;
          return (
            <li key={s.title} className="border-b border-line">
              <Link
                href="/services"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group flex items-center gap-4 py-5 md:gap-6 md:py-6"
              >
                <Photo src={images[i]} alt="" sizes="80px" className="size-16 shrink-0 md:size-20 lg:hidden" />
                <span className="min-w-0 flex-1">
                  <span className={`heading block text-xl transition-colors duration-200 md:text-2xl ${on ? "lg:text-ink" : "lg:text-ink/70"} group-hover:text-ink`}>
                    {s.title}
                  </span>
                  <span className="mt-1.5 block text-sm text-muted md:text-base">{s.text}</span>
                </span>
                <span
                  aria-hidden
                  className={`grid size-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color] duration-200 ${
                    on ? "lg:border-ink lg:bg-ink lg:text-white" : "border-line text-ink"
                  } group-hover:border-ink group-hover:bg-ink group-hover:text-white`}
                >
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Pinned photo (desktop) */}
      <div aria-hidden className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(var(--header-offset)+32px)] transition-[top] duration-500">
          <div className="relative aspect-[4/5] overflow-hidden bg-mist">
            {/* All photos stay mounted (and loaded); the active one crossfades in */}
            {images.map((src, i) => (
              <div
                key={src}
                className={`absolute inset-0 transition-[opacity,transform] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  i === active ? "z-[1] scale-100 opacity-100 duration-500" : `opacity-0 duration-300 ${reduce ? "" : "scale-[1.04]"}`
                }`}
              >
                <Photo src={src} alt="" sizes="(min-width: 1024px) 40vw, 1px" className="h-full w-full" />
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/70 to-transparent p-6 pt-16 text-white">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={active}
                  className="heading text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {items[active].title}
                </motion.p>
              </AnimatePresence>
              <p className="tabular mt-1 text-sm text-white/75">
                {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

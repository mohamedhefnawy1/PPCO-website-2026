"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Photo from "./Photo";
import { RevealText, ease } from "./motion/primitives";
import { tc } from "@/lib/text";

/** Banner for inner pages: photo with scroll parallax, breadcrumb, and a title that rises word by word. */
export default function PageHero({
  title,
  image,
  crumbs = [],
  position = "50% 50%",
  intro,
}: {
  title: string;
  image: string;
  crumbs?: { label: string; href?: string }[];
  position?: string;
  intro?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[460px] items-end overflow-hidden bg-night text-white h-[64svh] max-h-[680px]">
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduce ? undefined : { y }}
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease }}
      >
        <Photo src={image} alt="" priority sizes="100vw" position={position} className="h-full w-full" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.2)_40%,rgba(0,0,0,0.88)_100%)]" />

      <motion.div style={reduce ? undefined : { opacity: fade }} className="wrap pb-12 md:pb-16">
        <motion.nav aria-label="Breadcrumb" initial={{ opacity: 0, transform: "translateY(10px)" }} animate={{ opacity: 1, transform: "translateY(0px)", transitionEnd: { transform: "none" } }} transition={{ duration: 0.7, ease, delay: 0.2 }}>
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden />
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
              </li>
            ))}
            <li className="flex items-center gap-1.5" aria-current="page">
              <ChevronRight className="size-3.5" aria-hidden />
              <span className="text-white">{tc(title)}</span>
            </li>
          </ol>
        </motion.nav>
        <RevealText
          as="h1"
          immediate
          delay={0.25}
          text={tc(title)}
          className="heading mt-5 max-w-[16ch] text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.98] tracking-[-0.035em]"
        />
        {intro && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="lead mt-6 max-w-[52ch] text-white/80">
            {intro}
          </motion.p>
        )}
      </motion.div>
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 h-[3px] bg-green"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.4, ease, delay: 0.3 }}
      />
    </section>
  );
}

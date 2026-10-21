"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, PlayCircle } from "lucide-react";
import Photo from "./Photo";
import { company, home } from "@/content/site";
import { tc } from "@/lib/text";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HomeHero() {
  const words = tc(home.hero.title).split(" ");
  return (
    <section className="relative isolate flex min-h-[640px] items-end overflow-hidden text-white h-[100svh] max-h-[1040px]">
      <motion.div className="absolute inset-0 -z-10" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2, ease }}>
        <Photo src={home.hero.image} alt="" priority sizes="100vw" position="50% 40%" className="h-full w-full" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(20,18,51,0.65)_0%,rgba(20,18,51,0.1)_35%,rgba(20,18,51,0.25)_55%,rgba(20,18,51,0.9)_100%)]" />

      <div className="wrap pb-14 md:pb-20">
        <h1 className="heading text-[clamp(3rem,7.4vw,7.25rem)] leading-[1] tracking-[-0.03em]">
          {words.map((w, i) => (
            <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.07 }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.7 }}
          className="mt-8 grid gap-8 md:grid-cols-12 md:items-end"
        >
          <p className="lead max-w-[42ch] text-white/85 md:col-span-6 md:text-xl">{home.hero.lead}</p>
          <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
            <Link href="#vid" className="btn btn-white">
              <PlayCircle className="size-4" aria-hidden /> {home.hero.cta}
            </Link>
            <a href={company.profilePdf} target="_blank" rel="noreferrer" className="btn btn-outline-light">
              <FileText className="size-4" aria-hidden /> Company Profile
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

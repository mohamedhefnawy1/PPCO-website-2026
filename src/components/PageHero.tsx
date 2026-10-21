"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Photo from "./Photo";
import { tc } from "@/lib/text";

const ease = [0.22, 1, 0.36, 1] as const;

/** Banner for inner pages: photo, breadcrumb and page title. */
export default function PageHero({
  title,
  image,
  crumbs = [],
  position = "50% 50%",
}: {
  title: string;
  image: string;
  crumbs?: { label: string; href?: string }[];
  position?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-night text-white h-[56svh] max-h-[620px]">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.05, opacity: 0.6 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease }}
      >
        <Photo src={image} alt="" priority sizes="100vw" position={position} className="h-full w-full" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(20,18,51,0.7)_0%,rgba(20,18,51,0.25)_40%,rgba(20,18,51,0.85)_100%)]" />

      <div className="wrap pb-12 md:pb-16">
        <nav aria-label="Breadcrumb">
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
        </nav>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="heading h1 mt-5 max-w-[18ch]"
        >
          {tc(title)}
        </motion.h1>
      </div>
    </section>
  );
}

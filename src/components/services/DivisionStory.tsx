"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Photo from "../Photo";
import { ImageReveal, Reveal, RevealText, ease } from "../motion/primitives";
import { tc } from "@/lib/text";
import { quoteHref } from "@/content/site";

type Division = { id: string; title: string; scope: string; paragraphs: string[]; images: string[] };

/**
 * Scroll story: the photo column stays pinned while the three divisions scroll past,
 * swapping to each division's photo as it becomes the one being read.
 */
export default function DivisionStory({ divisions }: { divisions: Division[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start center", "end center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrap} className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
      {/* Pinned photo (desktop) */}
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-[calc(var(--header-offset)+76px)] h-[calc(100svh-180px)] max-h-[760px] transition-[top] duration-500">
          <div className="relative h-full w-full overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0.999 }}
                transition={{ duration: 1, ease }}
              >
                <motion.div className="h-full w-full" initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease }}>
                  <Photo src={divisions[active].images[0]} alt="" sizes="50vw" className="h-full w-full" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between bg-gradient-to-t from-night/70 to-transparent p-6 text-white">
              <AnimatePresence mode="wait">
                <motion.span
                  key={active}
                  className="heading text-2xl"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                >
                  {tc(divisions[active].title)}
                </motion.span>
              </AnimatePresence>
              <span className="tabular text-sm text-white/70">
                {active + 1} / {divisions.length}
              </span>
            </div>
            <motion.span aria-hidden className="absolute left-0 top-0 h-full w-[3px] origin-top bg-green" style={{ scaleY: progress }} />
          </div>
        </div>
      </div>

      {/* Text column */}
      <div className="lg:col-span-5 lg:col-start-8">
        {divisions.map((d, i) => (
          <article
            key={d.id}
            id={d.id}
            data-index={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="scroll-mt-36 border-t border-line py-16 first:border-t-0 first:pt-0 lg:min-h-[85svh] lg:py-24"
          >
            <ImageReveal className="mb-10 aspect-[16/10] lg:hidden">
              <Photo src={d.images[0]} alt="" sizes="100vw" className="h-full w-full" />
            </ImageReveal>
            <RevealText text={tc(d.title)} className="heading h2" />
            <Reveal delay={0.1}>
              <p className="mt-5 font-medium text-ink">{d.scope}</p>
            </Reveal>
            <div className="prose-body mt-8 text-muted">
              {d.paragraphs.map((p, k) => (
                <Reveal key={p} delay={0.05 * k}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <ImageReveal direction="right" className="mt-10 aspect-[16/9]">
              <Photo src={d.images[1]} alt="" sizes="(min-width: 1024px) 40vw, 100vw" className="h-full w-full" />
            </ImageReveal>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href={quoteHref(d.id)} className="btn btn-primary">
                Request a quote for {tc(d.title).replace(/ Solutions$/, "").toLowerCase()} works <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href={`/projects/?division=${d.id}#division-panel`} className="link">
                {tc(d.title)} projects <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

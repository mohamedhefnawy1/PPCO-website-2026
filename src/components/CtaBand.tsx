import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Photo from "./Photo";
import { Parallax, Reveal, RevealText } from "./motion/primitives";
import { home, quoteHref } from "@/content/site";

/** Closing call to action used at the end of the main pages: request a quote, or get in touch. */
export default function CtaBand({ service }: { service?: string }) {
  const { cta } = home;
  return (
    <section className="relative isolate overflow-hidden text-white">
      <Parallax strength={14} className="absolute inset-0 -z-10">
        <Photo src={cta.image} alt="" sizes="100vw" className="h-full w-full" />
      </Parallax>
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/75" />
      <div className="wrap py-24 md:py-32">
        <RevealText text={cta.title} as="h2" className="heading max-w-[14ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[1] tracking-[-0.03em]" />
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.15}>
            <p className="lead max-w-[44ch] text-white/80">{cta.body}</p>
          </Reveal>
          <Reveal delay={0.2} className="flex flex-wrap items-center gap-3">
            <Link href={quoteHref(service)} className="btn btn-white">
              Request a Quote <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/contact" className="btn btn-outline-light">
              {cta.button}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

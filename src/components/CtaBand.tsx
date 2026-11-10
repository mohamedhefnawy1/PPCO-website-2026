import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Photo from "./Photo";
import { Parallax, Reveal, RevealText } from "./motion/primitives";
import { home, quoteHref } from "@/content/site";

/**
 * Closing call to action used at the end of the main pages: request a quote, or get in touch.
 * A rounded photo with the message on a sheet of glass and glass buttons.
 */
export default function CtaBand({ service }: { service?: string }) {
  const { cta } = home;
  return (
    <section className="wrap pb-5 pt-5 md:pb-8 md:pt-8">
      <div className="frame relative isolate flex min-h-[520px] items-end text-white md:min-h-[600px] md:items-center">
        <Parallax strength={10} className="absolute inset-0 -z-10">
          <Photo src={cta.image} alt="" sizes="100vw" className="h-full w-full" />
        </Parallax>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.5),rgba(0,0,0,0.12)_70%)]" />
        <div className="glass m-3 w-full p-7 md:m-10 md:max-w-[640px] md:p-12 lg:m-14">
          <RevealText text={cta.title} as="h2" className="heading text-[clamp(2rem,4vw,3.5rem)] leading-[1.04] tracking-[-0.03em]" />
          <Reveal delay={0.15}>
            <p className="lead mt-5 max-w-[40ch] text-white/90">{cta.body}</p>
          </Reveal>
          <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={quoteHref(service)} className="btn btn-glass-light">
              Request a Quote <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/contact" className="btn btn-glass">
              {cta.button}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

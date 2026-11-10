import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import SubNav from "@/components/SubNav";
import Photo from "@/components/Photo";
import DivisionStory from "@/components/services/DivisionStory";
import { ImageReveal, Parallax, Reveal, RevealText } from "@/components/motion/primitives";
import { company, ppm, quoteHref, servicesPage as s } from "@/content/site";
import { tc } from "@/lib/text";

export const metadata: Metadata = { title: "Services", description: s.intro.body };

export default function ServicesPage() {
  const sub = [...s.divisions.map((d) => ({ id: d.id, label: tc(d.title) })), { id: "ppm", label: ppm.short }];
  return (
    <>
      <PageHero title={s.title} image={s.heroImage} />
      <SubNav items={sub} />

      {/* Overview */}
      <section className="section">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">{s.intro.subtitle}</p>
              </Reveal>
              <RevealText text={s.intro.title} className="heading h2 mt-4" />
            </div>
            <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
              <p className="lead text-muted">{s.intro.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={quoteHref()} className="btn btn-primary">
                  Request a Quote <ArrowRight className="size-4" aria-hidden />
                </Link>
                <a href={company.profilePdf} target="_blank" rel="noreferrer" className="btn btn-outline">
                  <FileText className="size-4" aria-hidden /> Company Profile
                <span className="sr-only"> (opens in a new tab)</span></a>
              </div>
            </Reveal>
          </div>
          <ul className="mt-14 grid gap-3 md:grid-cols-3 lg:mt-20">
            {s.divisions.map((d, i) => (
              <Reveal as="li" key={d.id} delay={i * 0.1}>
                <a href={`#${d.id}`} className="group block h-full">
                  <div className="flex h-full flex-col border border-line p-6 transition-colors duration-300 hover:border-ink md:p-8">
                    <h3 className="heading h3">{tc(d.title)}</h3>
                    <p className="mb-8 mt-4 text-muted">{d.scope}</p>
                    <span className="mt-auto grid size-10 place-items-center self-start rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white" aria-hidden>
                      <ArrowDown className="size-4" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Divisions: pinned photo scroll story */}
      <section className="section bg-mist">
        <DivisionStory divisions={s.divisions} />
      </section>

      {/* PPM */}
      <section id="ppm" className="relative isolate scroll-mt-32 overflow-hidden bg-night text-white">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 py-16 md:px-16 md:py-24 xl:px-24">
            <Reveal>
              <p className="eyebrow !text-white/80">{ppm.short}</p>
            </Reveal>
            <RevealText text={ppm.title} className="heading h2 mt-4 max-w-[16ch]" />
            {ppm.body.map((p, i) => (
              <Reveal key={p} delay={0.1 + i * 0.1}>
                <p className="lead mt-6 max-w-[54ch] text-white/75">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
              <a href={company.ppmUrl} target="_blank" rel="noreferrer" className="btn btn-white">
                {ppm.cta} <ArrowUpRight className="size-4" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <Link href={quoteHref("mining")} className="btn btn-outline-light">
                Request a Quote <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
          <ImageReveal direction="right" className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[600px]">
            <Parallax strength={10} className="h-full w-full">
              <Photo src={ppm.image} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full" />
            </Parallax>
          </ImageReveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

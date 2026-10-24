import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Photo from "@/components/Photo";
import Counter from "@/components/Counter";
import StoryVideos from "@/components/StoryVideos";
import HomeHero from "@/components/HomeHero";
import CtaBand from "@/components/CtaBand";
import { locationProjects, pastClients } from "@/lib/csv";
import LocationsMap from "@/components/home/LocationsMap";
import { locations, projectInLocation } from "@/content/locations";
import Disciplines from "@/components/home/Disciplines";
import ServicesList from "@/components/home/ServicesList";
import PausableBands from "@/components/motion/PausableBands";
import { ImageReveal, Parallax, Reveal, RevealText, ScrollText } from "@/components/motion/primitives";
import { company, home, ppm, projectsPage } from "@/content/site";
import { tc } from "@/lib/text";

export default function Home() {
  const { whoWeAre, disciplines, story, trackRecord, services, clients } = home;
  const half = Math.ceil(clients.logos.length / 2);

  return (
    <>
      <HomeHero clients={pastClients()} />

      {/* Who we are: the statement brightens word by word as you scroll */}
      <section id="who" className="section relative overflow-hidden">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="eyebrow">{tc(whoWeAre.eyebrow)}</p>
            </Reveal>
            <RevealText text={whoWeAre.title} className="heading mt-4 text-2xl md:text-3xl" />
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <ScrollText text={whoWeAre.body} className="heading text-[clamp(1.6rem,3.1vw,2.9rem)] leading-[1.18] tracking-[-0.02em]" />
            <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center gap-3">
              <Link href="/company" className="btn btn-primary">
                About PPCO <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/projects" className="btn btn-outline">
                Projects
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Locations: interactive map of offices, yards and project sites */}
      <section id="locations" className="section scroll-mt-20 border-t border-line pt-16 md:pt-20">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">{home.map.eyebrow}</p>
              </Reveal>
              <RevealText text={home.map.title} className="heading h2 mt-4" />
            </div>
            <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
              <p className="lead text-muted">{home.map.body}</p>
            </Reveal>
          </div>
          <div className="mt-12 lg:mt-16">
            <LocationsMap stats={locationProjects(projectsPage.divisions, locations, projectInLocation)} />
          </div>
        </div>
      </section>

      {/* Clients: two drifting bands */}
      <section className="section overflow-hidden bg-mist">
        <div className="wrap grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">{tc(clients.eyebrow)}</p>
            </Reveal>
            <RevealText text={clients.title} className="heading h2 mt-4" />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="lead text-muted">{clients.body}</p>
          </Reveal>
        </div>
        <PausableBands
          className="mt-10 lg:mt-14"
          bandsClassName="mt-6 space-y-3"
          label="Clients and partners"
          bands={[clients.logos.slice(0, half), clients.logos.slice(half)].map((row, r) => ({
            speed: 55,
            reverse: r === 1,
            content: row.map(({ src, box }) => (
              <span key={src} className="mr-3 flex h-28 w-44 shrink-0 items-center justify-center bg-white px-5 py-4 md:h-32 md:w-52 md:px-6 md:py-5">
                {/* Cropped to the logo's own outline and fitted inside the tile, so no logo is clipped or undersized.
                    An SVG <image> loads straight away, unlike a lazy <img> inside a moving band. */}
                <svg viewBox={box.join(" ")} preserveAspectRatio="xMidYMid meet" className="h-full w-full" aria-hidden>
                  <image href={src} x="0" y="0" width="500" height="500" />
                </svg>
              </span>
            )),
          }))}
        />
      </section>

      {/* Core services: rows with a photo of the service on hover */}
      <section className="section">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">{tc(services.eyebrow)}</p>
              </Reveal>
              <RevealText text={services.title} className="heading h2 mt-4" />
            </div>
            <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
              <p className="lead text-muted">{services.body}</p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="mt-14 lg:mt-20">
            <ServicesList />
          </Reveal>
        </div>
      </section>

      {/* Track record: an open, staggered layout instead of a grid */}
      <section className="section bg-mist">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <p className="eyebrow">{tc(trackRecord.eyebrow)}</p>
              </Reveal>
              <RevealText text={trackRecord.title} className="heading h2 mt-4" />
              <Reveal delay={0.15}>
                <p className="mt-6 text-muted">{trackRecord.body}</p>
              </Reveal>
            </div>
          </div>
          <dl className="lg:col-span-7 lg:col-start-6">
            {trackRecord.stats.map((s, i) => (
              <Reveal
                key={s.label}
                delay={i * 0.05}
                className={`flex flex-col gap-1 border-t border-line py-8 md:flex-row md:items-baseline md:justify-between md:gap-10 ${i % 2 ? "md:pl-[12%]" : ""}`}
              >
                <dt className="order-2 text-lg text-muted md:order-2 md:max-w-[16ch] md:text-right">{s.label}</dt>
                <dd className="heading order-1 text-[clamp(3.5rem,8vw,7.5rem)] leading-none tracking-[-0.04em] text-ink">
                  <Counter value={s.value} suffix={s.suffix} suffixClassName={s.suffix.length > 2 ? "ml-2 text-[0.32em] tracking-normal text-ink" : "text-green"} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Core disciplines: expanding panels */}
      <section className="section">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">{tc(disciplines.eyebrow)}</p>
              </Reveal>
              <RevealText text={disciplines.title} className="heading h2 mt-4" />
            </div>
            <Reveal delay={0.15} className="lead text-muted lg:col-span-4 lg:col-start-9">
              <p>{disciplines.body}</p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="mt-14 lg:mt-20">
            <Disciplines />
          </Reveal>
        </div>
      </section>

      {/* PPM */}
      <section className="relative isolate overflow-hidden bg-night text-white">
        <div className="grid lg:grid-cols-2">
          <ImageReveal direction="left" className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[640px]">
            <Parallax strength={10} className="h-full w-full">
              <Photo src={ppm.image} alt="Heavy machinery on a mining site" sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full" />
            </Parallax>
          </ImageReveal>
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
            <Reveal delay={0.3} className="mt-10">
              <a href={company.ppmUrl} target="_blank" rel="noreferrer" className="btn btn-white">
                {ppm.cta} <ArrowUpRight className="size-4" aria-hidden />
              <span className="sr-only"> (opens in a new tab)</span></a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section id="vid" className="section scroll-mt-20">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">{tc(story.eyebrow)}</p>
              </Reveal>
              <RevealText text={story.title} className="heading h2 mt-4" />
            </div>
            <Reveal delay={0.15} className="lead text-muted lg:col-span-4 lg:col-start-9">
              <p>{story.body}</p>
            </Reveal>
          </div>
          <div className="mt-14 lg:mt-20">
            <StoryVideos />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, Drill, Pickaxe, ShieldCheck, Siren, Wrench } from "lucide-react";
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
import { Reveal, RevealText, ScrollText } from "@/components/motion/primitives";
import { company, home, ppm, projectsPage } from "@/content/site";
import { tc } from "@/lib/text";

// PPM's capabilities, as listed in its introduction (ppm.body), one per glass tile.
const ppmCapabilities = [
  { label: "Exploration", icon: Compass },
  { label: "Drilling", icon: Drill },
  { label: "Mining Operations", icon: Pickaxe },
  { label: "Plant Maintenance", icon: Wrench },
  { label: "Emergency Response", icon: Siren },
  { label: "Digital Security", icon: ShieldCheck },
];

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

        {/* Key figures, in one quiet row (the full track record is on the Company page) */}
        <dl className="wrap mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 md:mt-24 md:grid-cols-3 md:pt-12 lg:grid-cols-5">
          {trackRecord.stats.map((st, i) => (
            <Reveal key={st.label} delay={i * 0.05} className="flex flex-col">
              <dt className="order-2 mt-2 text-sm text-muted">{st.label}</dt>
              <dd className="heading order-1 whitespace-nowrap text-[clamp(2.25rem,3.6vw,3.5rem)] leading-none tracking-[-0.03em]">
                <Counter value={st.value} suffix={st.suffix} suffixClassName={st.suffix.length > 2 ? "ml-1.5 text-[0.36em] tracking-normal" : "text-green"} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Locations: the section is a map of the region, with the offices, yards and project sites on it */}
      <LocationsMap
        stats={locationProjects(projectsPage.divisions, locations, projectInLocation)}
        eyebrow={home.map.eyebrow}
        title={home.map.title}
        body={home.map.body}
      />

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
              <span key={src} className="mr-3 flex h-28 w-44 shrink-0 items-center justify-center rounded bg-white px-5 py-4 md:h-32 md:w-52 md:px-6 md:py-5">
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

      {/* Core services: names on the left; on the right the photo, with the name and description on glass */}
      <section className="section">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow">{tc(services.eyebrow)}</p>
              </Reveal>
              <RevealText text={services.title} className="heading h2 mt-4" />
            </div>
            <Reveal delay={0.15} className="lg:col-span-5 lg:col-start-8">
              <p className="lead text-muted lg:[text-wrap:balance]">{services.body}</p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="mt-14 lg:mt-20">
            <ServicesList />
          </Reveal>
        </div>
      </section>

      {/* Core disciplines: a plain row of four cards */}
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
          <div className="mt-12 lg:mt-16">
            <Disciplines />
          </div>
        </div>
      </section>

      {/* PPM: the photo runs the full width; the content sits on glass tiles over its right side */}
      <section className="relative isolate overflow-hidden bg-night text-white">
        {/* Wide screens: the whole photo, excavator on the left. Small screens: the excavator in a block at the
            top, fading into the photo's fog and rock, which carry on behind the tiles. */}
        <Photo src={ppm.wideImage} alt="An excavator working a mining site" sizes="100vw" position="18% 50%" className="!absolute inset-0 -z-10 hidden h-full w-full lg:block" />
        <Photo src={ppm.wideImage} alt="" sizes="300vw" position="86% 50%" className="!absolute inset-0 -z-10 h-full w-full lg:hidden" />
        <Photo
          src={ppm.wideImage}
          alt="An excavator working a mining site"
          sizes="250vw"
          position="20% 50%"
          className="!absolute inset-x-0 top-0 -z-10 h-[100vw] w-full [mask-image:linear-gradient(#000_72%,transparent)] sm:h-[66vw] lg:hidden"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0)_30%,rgba(0,0,0,0.55))] lg:bg-[linear-gradient(90deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.4))]" />
        <div className="wrap flex min-h-[720px] items-end pb-5 pt-[80vw] sm:pt-[54vw] md:pb-8 lg:min-h-[760px] lg:items-center lg:justify-end lg:py-24">
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[52%] xl:w-[46%]">
            <Reveal className="glass col-span-full p-7 md:p-10">
              <p className="eyebrow !text-white/85">{ppm.short}</p>
              <h2 className="heading h2 mt-4">{ppm.title}</h2>
              <p className="mt-5 max-w-[52ch] text-white/85 md:text-lg">{ppm.body[0]}</p>
            </Reveal>
            {ppmCapabilities.map(({ label, icon: Icon }, i) => (
              <Reveal key={label} delay={0.08 + i * 0.04} className="glass flex min-h-[112px] flex-col justify-between p-4 md:p-5">
                <Icon className="size-5 text-white/80" strokeWidth={1.6} aria-hidden />
                <p className="text-sm font-medium leading-tight md:text-base">{label}</p>
              </Reveal>
            ))}
            <Reveal delay={0.3} className="col-span-full">
              <a
                href={company.ppmUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-glass group flex items-center justify-between gap-4 rounded px-6 py-5 font-medium transition-[background,border-color] duration-200 md:px-7"
              >
                <span>
                  {ppm.cta}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <ArrowUpRight className="size-5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section id="vid" className="section scroll-mt-20">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">{tc(story.eyebrow)}</p>
          </Reveal>
          <RevealText text={story.title} className="heading h2 mt-4" />
          <div className="mt-10 lg:mt-14">
            <StoryVideos>
              <div className="flex h-full flex-col justify-between gap-8 rounded bg-mist p-7 md:p-8">
                <p className="lead text-ink">{story.body}</p>
                <Link href="/company" className="link self-start">
                  About PPCO <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </StoryVideos>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

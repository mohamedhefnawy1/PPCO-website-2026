/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, ClipboardCheck, Cog, FileText, Route, ShieldCheck, Truck } from "lucide-react";
import Photo from "@/components/Photo";
import SectionHeader from "@/components/SectionHeader";
import Counter from "@/components/Counter";
import StoryVideos from "@/components/StoryVideos";
import HomeHero from "@/components/HomeHero";
import { company, home, ppm } from "@/content/site";
import { tc } from "@/lib/text";

const icons = { building: Building2, cog: Cog, route: Route, shield: ShieldCheck, truck: Truck, clipboard: ClipboardCheck } as const;

export default function Home() {
  const { whoWeAre, disciplines, story, trackRecord, services, clients, cta } = home;
  return (
    <>
      <HomeHero />

      {/* Who we are */}
      <section className="section">
        <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="eyebrow">{tc(whoWeAre.eyebrow)}</p>
            <h2 className="heading h2 mt-4 max-w-[16ch]">{whoWeAre.title}</h2>
            <p className="lead mt-8 max-w-[56ch] text-muted">{whoWeAre.body}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/company" className="btn btn-primary">
                About PPCO <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/projects" className="btn btn-outline">
                Projects
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="bg-mist p-6 md:p-10">
              <img src={whoWeAre.image} alt="Map of Saudi Arabia showing PPCO locations" className="mx-auto w-full max-w-[520px]" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Core disciplines */}
      <section className="section bg-mist">
        <div className="wrap">
          <SectionHeader eyebrow={disciplines.eyebrow} title={disciplines.title}>
            <p>{disciplines.body}</p>
          </SectionHeader>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {disciplines.items.map((d) => (
              <li key={d.title}>
                <Link href={d.href} className="group flex h-full flex-col bg-white">
                  <Photo src={d.image} alt="" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] w-full" />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="heading h3">{tc(d.title)}</h3>
                    <p className="mb-8 mt-3 text-muted">{d.text}</p>
                    <span className="mt-auto grid size-10 place-items-center self-start border border-line text-indigo transition-colors group-hover:border-indigo group-hover:bg-indigo group-hover:text-white" aria-hidden>
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PPM */}
      <section className="bg-night text-white">
        <div className="grid lg:grid-cols-2">
          <Photo src={ppm.image} alt="Heavy machinery on a mining site" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[560px]" />
          <div className="flex flex-col justify-center px-5 py-16 md:px-16 md:py-20 xl:px-24">
            <p className="eyebrow !text-white/80">{ppm.short}</p>
            <h2 className="heading h2 mt-4 max-w-[16ch]">{ppm.title}</h2>
            {ppm.body.map((p) => (
              <p key={p} className="lead mt-6 max-w-[54ch] text-white/75">
                {p}
              </p>
            ))}
            <a href={company.ppmUrl} target="_blank" rel="noreferrer" className="btn btn-white mt-10 self-start">
              {ppm.cta} <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section id="vid" className="section scroll-mt-20">
        <div className="wrap">
          <SectionHeader eyebrow={story.eyebrow} title={story.title}>
            <p>{story.body}</p>
          </SectionHeader>
          <div className="mt-14 lg:mt-20">
            <StoryVideos />
          </div>
        </div>
      </section>

      {/* Track record */}
      <section className="section bg-mist">
        <div className="wrap">
          <SectionHeader eyebrow={trackRecord.eyebrow} title={trackRecord.title}>
            <p>{trackRecord.body}</p>
          </SectionHeader>
          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line lg:mt-20 lg:grid-cols-5">
            {trackRecord.stats.map((s, i) => (
              <div key={s.label} className={`flex flex-col bg-white p-6 md:p-8 ${i === 4 ? "col-span-2 lg:col-span-1" : ""}`}>
                <dt className="order-2 mt-3 text-muted">{s.label}</dt>
                <dd className="heading order-1 text-[clamp(2.25rem,3.6vw,3.5rem)] text-indigo">
                  <Counter value={s.value} suffix={s.suffix} suffixClassName={s.suffix.length > 2 ? "ml-1 text-[0.45em] tracking-normal" : ""} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Core services */}
      <section className="section">
        <div className="wrap">
          <SectionHeader
            eyebrow={services.eyebrow}
            title={services.title}
            action={
              <Link href="/services" className="link">
                Services <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          >
            <p>{services.body}</p>
          </SectionHeader>
          <ul className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {services.items.map((s) => {
              const Icon = icons[s.icon as keyof typeof icons];
              return (
                <li key={s.title} className="border-b border-r border-line p-6 md:p-10">
                  <Icon className="size-7 text-indigo" strokeWidth={1.5} aria-hidden />
                  <h3 className="heading h3 mt-8">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Clients */}
      <section className="section bg-mist">
        <div className="wrap">
          <SectionHeader eyebrow={clients.eyebrow} title={clients.title}>
            <p>{clients.body}</p>
          </SectionHeader>
          <ul className="mt-14 grid grid-cols-4 border-l border-t border-line bg-white sm:grid-cols-5 lg:mt-20 lg:grid-cols-6 xl:grid-cols-8" aria-label="Clients and partners">
            {clients.logos.map((src) => (
              <li key={src} className="group flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-r border-line bg-white">
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="h-full w-full scale-[1.25] object-contain opacity-80 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden text-white">
        <Photo src={cta.image} alt="" sizes="100vw" className="absolute inset-0 -z-10 h-full w-full" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-indigo-deep/85" />
        <div className="wrap grid gap-8 py-20 md:py-28 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 className="heading h2 max-w-[18ch]">{cta.title}</h2>
            <p className="lead mt-6 max-w-[48ch] text-white/80">{cta.body}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Link href="/contact" className="btn btn-white">
              {cta.button} <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a href={company.profilePdf} target="_blank" rel="noreferrer" className="btn btn-outline-light">
              <FileText className="size-4" aria-hidden /> Company Profile
            </a>
          </div>
        </div>
      </section>
    </>
  );
}


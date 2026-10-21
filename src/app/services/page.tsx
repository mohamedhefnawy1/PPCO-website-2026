import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SubNav from "@/components/SubNav";
import Photo from "@/components/Photo";
import { company, ppm, servicesPage as s } from "@/content/site";
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
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <p className="eyebrow">{s.intro.subtitle}</p>
              <h2 className="heading h2 mt-4">{s.intro.title}</h2>
            </div>
            <p className="lead text-muted lg:col-span-5 lg:col-start-8 lg:self-end">{s.intro.body}</p>
          </div>
          <ul className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3 lg:mt-20">
            {s.divisions.map((d) => (
              <li key={d.id} className="bg-white">
                <a href={`#${d.id}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-mist md:p-8">
                  <h3 className="heading h3">{tc(d.title)}</h3>
                  <p className="mb-8 mt-4 text-muted">{d.scope}</p>
                  <span className="mt-auto grid size-10 place-items-center self-start border border-line text-indigo transition-colors group-hover:border-indigo group-hover:bg-indigo group-hover:text-white" aria-hidden>
                    <ArrowDown className="size-4" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Divisions */}
      {s.divisions.map((d, i) => (
        <section key={d.id} id={d.id} className={`section scroll-mt-32 ${i % 2 === 0 ? "bg-mist" : ""}`}>
          <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2 lg:col-start-7" : ""}`}>
              <div className="grid grid-cols-6 gap-3">
                <Photo src={d.images[0]} alt="" sizes="(min-width: 1024px) 40vw, 100vw" className="col-span-6 aspect-[16/10] w-full md:col-span-4 md:aspect-[4/5]" />
                <Photo src={d.images[1]} alt="" sizes="(min-width: 1024px) 20vw, 50vw" className="col-span-6 aspect-[16/10] w-full md:col-span-2 md:aspect-auto md:h-full" />
              </div>
            </div>
            <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-1" : "lg:col-start-8"}`}>
              <h2 className="heading h2">{tc(d.title)}</h2>
              <p className="mt-4 font-medium text-indigo">{d.scope}</p>
              <div className="prose-body mt-8 text-muted">
                {d.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Link href="/projects" className="link mt-8">
                Projects <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* PPM */}
      <section id="ppm" className="scroll-mt-32 bg-night text-white">
        <div className="grid lg:grid-cols-2">
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
          <Photo src={ppm.image} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[560px]" />
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SafetyTable from "@/components/SafetyTable";
import Certificates from "@/components/Certificates";
import Counter from "@/components/Counter";
import { Reveal, RevealText, ScrollText } from "@/components/motion/primitives";
import { qualityPage as q } from "@/content/site";
import { tc } from "@/lib/text";

export const metadata: Metadata = { title: "Quality & Safety", description: q.paragraphs[0].slice(0, 155) };

const num = (v: string) => Number(v.replace(/,/g, "").replace(/\.00$/, ""));

export default function QualitySafetyPage() {
  const year = q.table.years[0];
  const highlights = [q.table.rows[0], q.table.rows[3], q.table.rows[4]];
  const [lead, ...rest] = q.paragraphs[0].split(". ");
  const restText = rest.join(". ");

  return (
    <>
      <PageHero title={q.title} image={q.heroImage} crumbs={[{ label: "Company", href: "/company" }]} />

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <ScrollText text={`${lead}.`} className="heading text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.15] tracking-[-0.02em]" />
            <div className="prose-body mt-10 max-w-[68ch] text-muted">
              <Reveal>
                <p>{restText}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>{q.paragraphs[1]}</p>
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal className="relative overflow-hidden bg-ink p-8 text-white md:p-10 lg:sticky lg:top-28">
              <span aria-hidden className="absolute -right-6 -top-10 select-none text-[10rem] font-semibold leading-none text-white/[0.06]">
                ”
              </span>
              <h2 className="relative text-sm font-medium text-white/70">{tc(q.missionTitle)}</h2>
              <p className="relative mt-4 text-lg leading-relaxed">{q.mission}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="wrap">
          <dl className="grid gap-y-10 md:grid-cols-3 md:gap-x-8">
            {highlights.map((r, i) => (
              <Reveal key={r.label} delay={i * 0.1} className="flex flex-col border-t-2 border-ink pt-6">
                <dt className="order-2 mt-3 text-muted">
                  {r.label}, {year}
                </dt>
                <dd className="heading order-1 text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-[-0.04em] text-ink">
                  <Counter value={num(r.values[0])} />
                </dd>
              </Reveal>
            ))}
          </dl>
          <Reveal className="mt-16">
            <SafetyTable years={q.table.years} rows={q.table.rows} caption="Safety statistics by year" />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <RevealText text="Certificates" className="heading h2" />
          <div className="mt-12">
            <Certificates images={q.certificates} />
          </div>
        </div>
      </section>
    </>
  );
}

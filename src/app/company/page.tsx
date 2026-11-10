import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, Mail, MapPin } from "lucide-react";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import SubNav from "@/components/SubNav";
import SafetyTable from "@/components/SafetyTable";
import { Reveal, RevealText, ScrollText } from "@/components/motion/primitives";
import Counter from "@/components/Counter";
import { companyPage as c, home } from "@/content/site";
import { tc } from "@/lib/text";

export const metadata: Metadata = { title: "Company", description: c.history.paragraphs[0] };

const sections = [
  { id: "history", label: tc(c.history.title) },
  { id: "track-record", label: "Track Record" },
  { id: "philosophy", label: tc(c.philosophy.title) },
  { id: "quality-safety", label: tc(c.qualitySafety.title) },
  { id: "people", label: tc(c.people.title) },
];

export default function CompanyPage() {
  const { philosophy: ph, qualitySafety: qs } = c;
  const { trackRecord } = home;
  const [historyLead, ...historyRest] = c.history.paragraphs;
  const [peopleLead, ...peopleRest] = c.people.paragraphs;

  return (
    <>
      <PageHero title={c.title} image={c.heroImage} />
      <SubNav items={sections} />

      {/* History */}
      <section id="history" className="section relative scroll-mt-36">
        <div className="wrap relative grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Reveal>
              <p className="eyebrow">{tc(c.history.title)}</p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <ScrollText text={historyLead} className="heading text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.25] tracking-[-0.015em]" />
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {historyRest.map((p, i) => (
                <Reveal key={p} delay={i * 0.1}>
                  <p className="text-muted">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Track record: the full figures (the home page shows them as one short row) */}
      <section id="track-record" className="section scroll-mt-36 border-t border-line">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-40">
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
            {trackRecord.stats.map((st, i) => (
              <Reveal
                key={st.label}
                delay={i * 0.05}
                className={`flex flex-col gap-1 border-t border-line py-8 md:flex-row md:items-baseline md:justify-between md:gap-10 ${i % 2 ? "md:pl-[12%]" : ""}`}
              >
                <dt className="order-2 text-lg text-muted md:max-w-[16ch] md:text-right">{st.label}</dt>
                <dd className="heading order-1 text-[clamp(3.5rem,8vw,7.5rem)] leading-none tracking-[-0.04em] text-ink">
                  <Counter value={st.value} suffix={st.suffix} suffixClassName={st.suffix.length > 2 ? "ml-2 text-[0.32em] tracking-normal text-ink" : "text-green"} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" className="section scroll-mt-36 bg-mist">
        <div className="wrap">
          <RevealText text={tc(ph.title)} className="heading h2" />
          <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
            {[ph.mission, ph.vision].map((b, i) => (
              <Reveal key={b.title} delay={i * 0.12} className={i === 1 ? "md:mt-24" : ""}>
                <h3 className="heading text-[clamp(2rem,3vw,2.75rem)] text-ink">{tc(b.title)}</h3>
                <div className="prose-body mt-5 text-muted">
                  {b.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-24 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <RevealText as="h3" text={tc(ph.values.title)} className="heading text-[clamp(2rem,3vw,2.75rem)]" />
              <Reveal delay={0.1}>
                <p className="mt-4 text-muted">{ph.values.intro}</p>
              </Reveal>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              {ph.values.items.map((v, i) => (
                <Reveal as="li" key={v.name} delay={(i % 2) * 0.08 + Math.floor(i / 2) * 0.06}>
                  <div className="h-full border border-line bg-white p-6 transition-colors duration-300 hover:border-ink/40 md:p-7">
                    <p className="text-lg font-medium text-ink">{v.name}</p>
                    <p className="mt-2 text-muted">{v.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quality & safety */}
      <section id="quality-safety" className="section scroll-mt-36">
        <div className="wrap">
          <div className="grid gap-8 lg:grid-cols-12">
            <RevealText text={tc(qs.title)} className="heading h2 lg:col-span-5" />
            <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
              <p className="lead text-muted">{qs.intro}</p>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
            {[qs.quality, qs.safety].map((b, k) => (
              <Reveal key={b.title} delay={k * 0.1}>
                <h3 className="heading h3">{b.title}</h3>
                <p className="mt-3 text-muted">{b.intro}</p>
                <ul className="mt-6 space-y-3">
                  {b.items.map((it) => (
                    <li key={it} className="flex gap-4 border-t border-line pt-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded bg-green/12 text-green-deep">
                        <Check className="size-3.5" aria-hidden />
                      </span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-12 max-w-[68ch] text-muted">{qs.closing}</p>
          </Reveal>
          <Reveal className="mt-10">
            <SafetyTable years={qs.table.years} rows={qs.table.rows} caption="Safety statistics by year" />
          </Reveal>
          <Link href="/training-and-safety" className="link mt-8">
            Quality & Safety <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* People + contact */}
      <section id="people" className="section scroll-mt-36 bg-night text-white">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow !text-white/80">{tc(c.people.title)}</p>
            </Reveal>
            <ScrollText text={peopleLead} className="heading mt-6 text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.25] tracking-[-0.015em]" />
            <div className="prose-body mt-10 text-white/70">
              {peopleRest.map((p, i) => (
                <Reveal key={p} delay={i * 0.06}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Link href="/list-of-staff-and-manpower" className="link mt-8 !text-white !decoration-white/40 hover:!decoration-white">
              List of Staff and Manpower <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <div className="space-y-4 lg:col-span-4 lg:col-start-9">
            <Reveal className="bg-white/[0.06] p-6 md:p-8">
              <h2 className="text-lg font-medium">{c.specializing.title}</h2>
              <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
                {c.specializing.items.map((d, i) => (
                  <li key={d}>
                    <Link href={`/services#${["civil", "mechanical", "electrical"][i]}`} className="group flex items-center justify-between py-3.5">
                      <span className="transition-transform duration-300 group-hover:translate-x-1">{tc(d)}</span>
                      <ArrowRight className="size-4 text-green transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="bg-white p-6 text-ink md:p-8">
              <h2 className="text-lg font-medium">{tc(c.contact.title)}</h2>
              <ul className="mt-5 space-y-3 text-muted">
                <li className="flex gap-3">
                  <MapPin className="mt-1 size-4 shrink-0 text-ink" aria-hidden />
                  <span>
                    {c.contact.lines[0]}
                    <br />
                    {c.contact.lines[1]}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-1 size-4 shrink-0 text-ink" aria-hidden />
                  <a href={`mailto:${c.contact.lines[2]}`} className="hover:text-ink">
                    {c.contact.lines[2]}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-1 size-4 shrink-0 text-ink" aria-hidden />
                  <span>{c.contact.lines[3]}</span>
                </li>
              </ul>
              <Link href="/contact" className="btn btn-primary mt-6 w-full justify-center">
                Contact
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

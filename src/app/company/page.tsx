import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, Mail, MapPin } from "lucide-react";
import PageHero from "@/components/PageHero";
import SubNav from "@/components/SubNav";
import SafetyTable from "@/components/SafetyTable";
import { companyPage as c } from "@/content/site";
import { tc } from "@/lib/text";

export const metadata: Metadata = { title: "Company", description: c.history.paragraphs[0] };

const sections = [
  { id: "history", label: tc(c.history.title) },
  { id: "philosophy", label: tc(c.philosophy.title) },
  { id: "quality-safety", label: tc(c.qualitySafety.title) },
  { id: "people", label: tc(c.people.title) },
];

export default function CompanyPage() {
  const { philosophy: ph, qualitySafety: qs } = c;
  return (
    <>
      <PageHero title={c.title} image={c.heroImage} />
      <SubNav items={sections} />

      <div className="wrap grid gap-16 py-16 md:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 space-y-24 md:space-y-32 lg:col-span-8">
          {/* History */}
          <section id="history" className="scroll-mt-40">
            <h2 className="heading h2">{tc(c.history.title)}</h2>
            <div className="prose-body lead mt-8 max-w-[68ch] text-muted">
              {c.history.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>

          {/* Philosophy */}
          <section id="philosophy" className="scroll-mt-40">
            <h2 className="heading h2">{tc(ph.title)}</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8">
              {[ph.mission, ph.vision].map((b) => (
                <div key={b.title}>
                  <h3 className="heading h3 border-t-2 border-indigo pt-5">{tc(b.title)}</h3>
                  <div className="prose-body mt-4 text-muted">
                    {b.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h3 className="heading h3 mt-16">{tc(ph.values.title)}</h3>
            <p className="mt-3 max-w-[60ch] text-muted">{ph.values.intro}</p>
            <ul className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
              {ph.values.items.map((v) => (
                <li key={v.name} className="bg-white p-6">
                  <p className="font-medium text-indigo">{v.name}</p>
                  <p className="mt-2 text-muted">{v.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Quality & safety */}
          <section id="quality-safety" className="scroll-mt-40">
            <h2 className="heading h2">{tc(qs.title)}</h2>
            <p className="lead mt-8 max-w-[68ch] text-muted">{qs.intro}</p>
            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8">
              {[qs.quality, qs.safety].map((b) => (
                <div key={b.title}>
                  <h3 className="heading h3">{b.title}</h3>
                  <p className="mt-3 text-muted">{b.intro}</p>
                  <ul className="mt-5 divide-y divide-line border-y border-line">
                    {b.items.map((it) => (
                      <li key={it} className="flex gap-3 py-3">
                        <Check className="mt-1 size-4 shrink-0 text-green" aria-hidden />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-10 max-w-[68ch] text-muted">{qs.closing}</p>
            <div className="mt-10">
              <SafetyTable years={qs.table.years} rows={qs.table.rows} caption="Safety statistics by year" />
            </div>
            <Link href="/training-and-safety" className="link mt-8">
              Quality & Safety <ArrowRight className="size-4" aria-hidden />
            </Link>
          </section>

          {/* People */}
          <section id="people" className="scroll-mt-40">
            <h2 className="heading h2">{tc(c.people.title)}</h2>
            <div className="prose-body lead mt-8 max-w-[68ch] text-muted">
              {c.people.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link href="/list-of-staff-and-manpower" className="link mt-8">
              List of Staff and Manpower <ArrowRight className="size-4" aria-hidden />
            </Link>
          </section>
        </div>

        {/* Aside */}
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="space-y-6 lg:sticky lg:top-40">
            <div className="bg-mist p-6 md:p-8">
              <h2 className="text-lg font-medium">{c.specializing.title}</h2>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {c.specializing.items.map((d, i) => (
                  <li key={d}>
                    <Link href={`/services#${["civil", "mechanical", "electrical"][i]}`} className="group flex items-center justify-between py-3.5">
                      <span>{tc(d)}</span>
                      <ArrowRight className="size-4 text-indigo transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-line p-6 md:p-8">
              <h2 className="text-lg font-medium">{tc(c.contact.title)}</h2>
              <ul className="mt-5 space-y-3 text-muted">
                <li className="flex gap-3">
                  <MapPin className="mt-1 size-4 shrink-0 text-indigo" aria-hidden />
                  <span>
                    {c.contact.lines[0]}
                    <br />
                    {c.contact.lines[1]}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-1 size-4 shrink-0 text-indigo" aria-hidden />
                  <a href={`mailto:${c.contact.lines[2]}`} className="hover:text-indigo">
                    {c.contact.lines[2]}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-1 size-4 shrink-0 text-indigo" aria-hidden />
                  <span>{c.contact.lines[3]}</span>
                </li>
              </ul>
              <Link href="/contact" className="btn btn-primary mt-6 w-full justify-center">
                Contact
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

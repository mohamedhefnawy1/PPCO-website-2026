import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SafetyTable from "@/components/SafetyTable";
import Certificates from "@/components/Certificates";
import { qualityPage as q } from "@/content/site";
import { tc } from "@/lib/text";

export const metadata: Metadata = { title: "Quality & Safety", description: q.paragraphs[0].slice(0, 155) };

export default function QualitySafetyPage() {
  const latest = q.table.rows[0].values[0];
  return (
    <>
      <PageHero title={q.title} image={q.heroImage} crumbs={[{ label: "Company", href: "/company" }]} />

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h2 className="heading h2">{q.title}</h2>
            <div className="prose-body lead mt-8 max-w-[68ch] text-muted">
              {q.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="bg-indigo p-8 text-white md:p-10 lg:sticky lg:top-28">
              <h2 className="text-sm font-medium text-white/70">{tc(q.missionTitle)}</h2>
              <p className="mt-4 text-lg leading-relaxed">{q.mission}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="wrap">
          <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
            {[
              { v: latest, l: `${q.table.rows[0].label}, ${q.table.years[0]}` },
              { v: q.table.rows[3].values[0], l: `${q.table.rows[3].label}, ${q.table.years[0]}` },
              { v: q.table.rows[4].values[0], l: `${q.table.rows[4].label}, ${q.table.years[0]}` },
            ].map((s) => (
              <div key={s.l} className="bg-white p-6 md:p-8">
                <p className="heading tabular text-[clamp(2rem,3.4vw,3rem)] text-indigo">{s.v.replace(/\.00$/, "")}</p>
                <p className="mt-2 text-muted">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <SafetyTable years={q.table.years} rows={q.table.rows} caption="Safety statistics by year" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="heading h2">Certificates</h2>
          <div className="mt-10">
            <Certificates images={q.certificates} />
          </div>
        </div>
      </section>
    </>
  );
}

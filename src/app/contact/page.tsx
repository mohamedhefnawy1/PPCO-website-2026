import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import { company, companyPage, contactPage as c } from "@/content/site";
import { tc } from "@/lib/text";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const [dammam, riyadh] = c.offices;
  return (
    <>
      <PageHero title={c.title} image={c.heroImage} />

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <h2 className="heading h2">{c.heading}</h2>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href={`mailto:${company.email}`} className="btn btn-primary">
                <Mail className="size-4" aria-hidden /> {company.email}
              </a>
              <a href={company.phoneHref} className="btn btn-outline">
                <Phone className="size-4" aria-hidden />
                <span className="tabular" dir="ltr">
                  {company.phone}
                </span>
              </a>
            </div>

            <ul className="mt-12 divide-y divide-line border-y border-line">
              <li className="py-6">
                <h3 className="text-lg font-medium">{dammam.city}</h3>
                <p className="mt-3 flex gap-3 text-muted">
                  <MapPin className="mt-1 size-4 shrink-0 text-indigo" aria-hidden />
                  {dammam.lines[0]}
                </p>
                <p className="mt-2 flex gap-3 text-muted">
                  <Mail className="mt-1 size-4 shrink-0 text-indigo" aria-hidden />
                  <a href={`mailto:${dammam.email}`} className="hover:text-indigo">
                    {dammam.email}
                  </a>
                </p>
                <p className="mt-2 flex gap-3 text-muted">
                  <Phone className="mt-1 size-4 shrink-0 text-indigo" aria-hidden />
                  <a href={company.phoneHref} className="hover:text-indigo">
                    {dammam.tel}
                  </a>
                </p>
                <p className="mt-2 flex gap-3 text-muted">
                  <Clock className="mt-1 size-4 shrink-0 text-indigo" aria-hidden />
                  {companyPage.contact.lines[3]}
                </p>
              </li>
              <li className="py-6">
                <h3 className="text-lg font-medium">{riyadh.city}</h3>
                <p className="mt-3 flex gap-3 text-muted">
                  <MapPin className="mt-1 size-4 shrink-0 text-indigo" aria-hidden />
                  {riyadh.lines[0]}
                </p>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="aspect-[4/3] w-full border border-line bg-mist lg:aspect-auto lg:h-full lg:min-h-[480px]">
              <iframe
                src={c.mapEmbed}
                title="Map showing Projects Pioneers Co. locations"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="wrap">
          <h2 className="heading h3">{c.siteOfficesLabel.replace(":", "")}</h2>
          <ul className="mt-8 grid grid-cols-2 border-l border-t border-line bg-white sm:grid-cols-3 lg:grid-cols-5">
            {c.siteOffices.map((o) => (
              <li key={o} className="flex items-center gap-3 border-b border-r border-line px-5 py-4">
                <span className="size-1.5 shrink-0 rounded-full bg-green" aria-hidden />
                {o === "NEOM" ? o : tc(o)}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

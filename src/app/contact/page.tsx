import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import CopyEmail from "@/components/CopyEmail";
import EnquiryForm from "@/components/EnquiryForm";
import OfficeMap from "@/components/OfficeMap";
import { Reveal, RevealText } from "@/components/motion/primitives";
import { company, companyPage, contactPage as c } from "@/content/site";

export const metadata: Metadata = { title: "Contact", description: "Contact PPCO in Dammam or Riyadh, or send a request for quote for civil, mechanical, electrical or mining works." };

export default function ContactPage() {
  const [dammam, riyadh] = c.offices;
  return (
    <>
      <PageHero title={c.title} image={c.heroImage} />

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <RevealText text={c.heading} className="heading text-[clamp(2.5rem,5vw,4.5rem)] leading-none tracking-[-0.03em]" />

            <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-3">
              <CopyEmail email={company.email} />
              <a href={company.phoneHref} className="btn btn-outline">
                <Phone className="size-4" aria-hidden />
                <span className="tabular" dir="ltr">
                  {company.phone}
                </span>
              </a>
            </Reveal>

            <div className="mt-14 space-y-3">
              <Reveal className="border border-line p-6 md:p-8">
                <h3 className="heading text-2xl">{dammam.city}</h3>
                <p className="mt-4 flex gap-3 text-muted">
                  <MapPin className="mt-1 size-4 shrink-0 text-ink" aria-hidden />
                  {dammam.lines[0]}
                </p>
                <p className="mt-2 flex gap-3 text-muted">
                  <Mail className="mt-1 size-4 shrink-0 text-ink" aria-hidden />
                  <a href={`mailto:${dammam.email}`} className="hover:text-ink">
                    {dammam.email}
                  </a>
                </p>
                <p className="mt-2 flex gap-3 text-muted">
                  <Phone className="mt-1 size-4 shrink-0 text-ink" aria-hidden />
                  <a href={company.phoneHref} className="hover:text-ink">
                    {dammam.tel}
                  </a>
                </p>
                <p className="mt-2 flex gap-3 text-muted">
                  <Clock className="mt-1 size-4 shrink-0 text-ink" aria-hidden />
                  {companyPage.contact.lines[3]}
                </p>
              </Reveal>
              <Reveal delay={0.1} className="border border-line p-6 md:p-8">
                <h3 className="heading text-2xl">{riyadh.city}</h3>
                <p className="mt-4 flex gap-3 text-muted">
                  <MapPin className="mt-1 size-4 shrink-0 text-ink" aria-hidden />
                  {riyadh.lines[0]}
                </p>
              </Reveal>
            </div>
          </div>

          <div id="enquiry" className="scroll-mt-[calc(var(--header-h)+24px)] lg:col-span-7 lg:col-start-6">
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* Map with offices and site offices: pick a location to move the map there */}
      <section id="map" className="section border-t border-line">
        <div className="wrap">
          <Reveal>
            <OfficeMap />
          </Reveal>
        </div>
      </section>
    </>
  );
}

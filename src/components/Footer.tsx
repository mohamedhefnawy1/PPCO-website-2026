import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { company, footer, nav, quoteHref } from "@/content/site";
import FluidText from "./FluidText";
import { tc } from "@/lib/text";

export default function Footer() {
  return (
    <footer className="bg-night text-white">
      <div className="wrap">
        <div className="grid gap-12 border-b border-white/10 py-16 md:grid-cols-12 md:py-20">
          <div className="md:col-span-12 lg:col-span-4">
            <Logo white className="h-16 md:h-20" />
            <p className="mt-6 max-w-[40ch] text-white/65">{company.footerAbout}</p>
            <Link href={quoteHref()} className="btn btn-white mt-8">
              Request a Quote <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          <nav aria-label="Company" className="md:col-span-4 lg:col-span-2 lg:col-start-5">
            <h2 className="text-sm font-medium text-white/45">Company</h2>
            <ul className="mt-5 space-y-3">
              {footer.company.map((l) => (
                <li key={l.label}>
                  {l.href === "PROFILE" ? (
                    <a href={company.profilePdf} target="_blank" rel="noreferrer" className="text-white/85 hover:text-white">
                      {l.label}
                    <span className="sr-only"> (opens in a new tab)</span></a>
                  ) : (
                    <Link href={l.href} className="text-white/85 hover:text-white">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services" className="md:col-span-4 lg:col-span-3">
            <h2 className="text-sm font-medium text-white/45">Services</h2>
            <ul className="mt-5 space-y-3">
              {footer.services.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-white/85 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4 lg:col-span-3 lg:col-start-10">
            <h2 className="text-sm font-medium text-white/45">Contact</h2>
            <ul className="mt-5 space-y-3 text-white/85">
              <li>
                <a href={`mailto:${company.email}`} className="flex items-start gap-3 hover:text-white">
                  <Mail className="mt-1 size-4 shrink-0 text-green" aria-hidden /> {company.email}
                </a>
              </li>
              <li>
                <a href={company.phoneHref} className="flex items-start gap-3 hover:text-white">
                  <Phone className="mt-1 size-4 shrink-0 text-green" aria-hidden />
                  <span className="tabular" dir="ltr">
                    {company.phone}
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-green" aria-hidden />
                <span>
                  <span lang="ar" dir="rtl" className="block text-left">
                    {company.footerAddressAr}
                  </span>
                  {company.footerAddress}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Decorative sign-off (WCAG treats pure decoration as exempt from contrast); hidden from screen readers.
            Moving the pointer over it stirs green and purple smoke inside the letters (see FluidText). */}
        {/* Sized to the footer's width: at this weight and tracking the line is 9.92× its font size wide,
            so 10% of the container width fills ~99% of one line, at any screen size. */}
        <div className="border-b border-white/10 pb-6 pt-10 [container-type:inline-size] md:pb-9 md:pt-14">
          <FluidText
            text={tc(company.tagline)}
            className="heading select-none whitespace-nowrap text-[10cqi] leading-[0.95] tracking-[-0.045em] [text-wrap:nowrap]"
          />
        </div>

        <div className="flex flex-col gap-4 py-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>{company.copyright}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {nav.map((n) => (
              <li key={n.label}>
                <Link href={n.href} className="hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

import type { Metadata, Viewport } from "next";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollManager from "@/components/motion/ScrollManager";
import ScrollProgress from "@/components/motion/ScrollProgress";
import Cursor from "@/components/motion/Cursor";
import { company } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://ppco-ksa.com"),
  title: { default: `${company.name} – ${company.tagline}`, template: `%s | ${company.name}` },
  description: "Building the Kingdom’s future with experience, innovation, and trust",
  openGraph: { siteName: company.name, type: "website", locale: "en_SA" },
};

export const viewport: Viewport = { themeColor: "#111111" };

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  alternateName: company.short,
  url: "https://ppco-ksa.com",
  email: company.email,
  telephone: company.phone,
  address: { "@type": "PostalAddress", addressLocality: "Dammam", postalCode: "32432", addressCountry: "SA" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <ScrollManager />
          <ScrollProgress />
          <Cursor />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

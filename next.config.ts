import type { NextConfig } from "next";

/**
 * Built as a static site (`next build` writes plain HTML, CSS and JS to `out/`) for Cloudflare Pages.
 * - Security headers are set in `public/_headers`, which Cloudflare Pages applies (Next's `headers()`
 *   does not run in a static export).
 * - The enquiry form is handled by a Cloudflare Pages Function in `functions/api/enquiry.ts`.
 * - Images are served as they are: Next's image optimiser needs a server. Once the site runs on its own
 *   domain on Cloudflare, Cloudflare Images can resize them (see README, "Publishing").
 */
const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  images: { unoptimized: true },
  // Same URLs as the current WordPress site (e.g. /company/), so existing links and search results keep working.
  trailingSlash: true,
};

export default nextConfig;

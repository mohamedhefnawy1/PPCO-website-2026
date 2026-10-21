import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Media is served from the current WordPress uploads folder.
    // Move it to /public or your own CDN before switching DNS, then update `up()` in src/content/site.ts.
    remotePatterns: [{ protocol: "https", hostname: "ppco-ksa.com", pathname: "/wp-content/uploads/**" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  // Same URLs as the current WordPress site (e.g. /company/), so existing links and search results keep working.
  trailingSlash: true,
};

export default nextConfig;

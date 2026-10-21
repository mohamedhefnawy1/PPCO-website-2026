import type { MetadataRoute } from "next";

const pages = ["", "company", "projects", "list-of-equipment", "list-of-staff-and-manpower", "training-and-safety", "services", "media", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({ url: `https://ppco-ksa.com/${p ? p + "/" : ""}`, lastModified: new Date() }));
}

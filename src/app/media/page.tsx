import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import MediaGallery from "@/components/MediaGallery";
import { mediaSites, mediaTitle } from "@/content/media";
import { up } from "@/content/site";

export const metadata: Metadata = { title: "Media Center" };

export default function MediaPage() {
  return (
    <>
      <PageHero title={mediaTitle} image={up("2025/12/2761.jpg")} />
      <MediaGallery sites={mediaSites} />
    </>
  );
}

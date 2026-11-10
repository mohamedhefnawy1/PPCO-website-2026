"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./motion/primitives";
import { Play, X } from "lucide-react";
import Photo from "./Photo";
import { videos } from "@/content/site";

/** Lightweight video cards: the YouTube player only loads after a click. */
export default function StoryVideos({ children }: { children?: React.ReactNode }) {
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [playing]);

  return (
    <>
      {/* The first film leads; the second sits beside it with the invitation to read more */}
      <div className="grid gap-4 md:gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-8">
          <VideoCard onPlay={() => setPlaying(videos[0].id)} poster={videos[0].poster} index={0} large />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:col-span-4 lg:grid-cols-1 lg:grid-rows-[auto_1fr]">
          <Reveal delay={0.1}>
            <VideoCard onPlay={() => setPlaying(videos[1].id)} poster={videos[1].poster} index={1} />
          </Reveal>
          {children && (
            <Reveal delay={0.18} className="h-full">
              {children}
            </Reveal>
          )}
        </div>
      </div>

      <AnimatePresence>
        {playing && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xl md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlaying(null)}
            role="dialog"
            aria-modal="true"
            aria-label="PPCO video"
          >
            <button
              type="button"
              onClick={() => setPlaying(null)}
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white text-ink transition-colors hover:bg-mist"
              aria-label="Close video"
              autoFocus
            >
              <X className="size-6" />
            </button>
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-video w-full max-w-6xl overflow-hidden rounded-[var(--radius-sm)]"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${playing}?autoplay=1&rel=0`}
                title="PPCO video"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Video card: poster with a play button; the photo eases in slightly on hover. */
function VideoCard({ onPlay, poster, index, large = false }: { onPlay: () => void; poster: string; index: number; large?: boolean }) {
  return (
    <button type="button" onClick={onPlay} className="frame group relative block w-full text-left" aria-label={`Play PPCO video ${index + 1}`}>
      <Photo
        src={poster}
        alt=""
        sizes={large ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
        className="aspect-video w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      />
      <span aria-hidden className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/10" />
      <span
        aria-hidden
        className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-[0_8px_24px_rgb(0_0_0/0.25)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${
          large ? "size-16 md:size-24" : "size-14 md:size-16"
        }`}
      >
        <Play className={`translate-x-[1px] fill-current ${large ? "size-5 md:size-7" : "size-4 md:size-5"}`} />
      </span>
    </button>
  );
}

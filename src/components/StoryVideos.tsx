"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import Photo from "./Photo";
import { videos } from "@/content/site";

/** Lightweight video cards: the YouTube player only loads after a click. */
export default function StoryVideos() {
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
      <ul className="grid gap-6 md:grid-cols-2">
        {videos.map((v, i) => (
          <li key={v.id}>
            <button
              type="button"
              onClick={() => setPlaying(v.id)}
              className="group relative block w-full overflow-hidden text-left"
              aria-label={`Play PPCO video ${i + 1}`}
            >
              <Photo src={v.poster} alt="" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-video w-full transition-transform duration-700 group-hover:scale-[1.02]" />
              <span aria-hidden className="absolute inset-0 bg-night/25 transition-colors group-hover:bg-night/40" />
              <span className="absolute left-6 top-1/2 flex -translate-y-1/2 items-center gap-4 md:left-8">
                <span className="grid size-16 place-items-center rounded-full bg-white text-indigo transition-transform duration-300 group-hover:scale-110 md:size-20">
                  <Play className="ml-1 size-6 fill-current md:size-7" aria-hidden />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {playing && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-night/95 p-4 md:p-12"
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
              className="absolute right-4 top-4 grid size-11 place-items-center text-white hover:bg-white/10"
              aria-label="Close video"
              autoFocus
            >
              <X className="size-6" />
            </button>
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-video w-full max-w-6xl"
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

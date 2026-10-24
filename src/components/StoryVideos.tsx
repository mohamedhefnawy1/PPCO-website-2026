"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./motion/primitives";
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
      <ul className="grid gap-6 md:grid-cols-2 md:gap-8">
        {videos.map((v, i) => (
          <Reveal as="li" key={v.id} delay={i * 0.12} className={i === 1 ? "md:mt-20" : ""}>
            <VideoCard onPlay={() => setPlaying(v.id)} poster={v.poster} index={i} />
          </Reveal>
        ))}
      </ul>

      <AnimatePresence>
        {playing && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 md:p-12"
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

/** Video card: poster with a play button; the photo eases in slightly on hover. */
function VideoCard({ onPlay, poster, index }: { onPlay: () => void; poster: string; index: number }) {
  return (
    <button type="button" onClick={onPlay} className="group relative block w-full overflow-hidden text-left" aria-label={`Play PPCO video ${index + 1}`}>
      <Photo
        src={poster}
        alt=""
        sizes="(min-width: 768px) 50vw, 100vw"
        className="aspect-video w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
      />
      <span aria-hidden className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/15" />
      <span className="absolute bottom-5 left-5 flex items-center gap-3 bg-white py-3 pl-4 pr-5 text-sm font-medium text-ink transition-colors duration-200 group-hover:bg-mist md:bottom-8 md:left-8">
        <Play className="size-4 fill-current" aria-hidden /> Play video
      </span>
    </button>
  );
}

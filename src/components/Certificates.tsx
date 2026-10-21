"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Expand } from "lucide-react";
import Lightbox from "./Lightbox";

export default function Certificates({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative flex aspect-[3/4] w-full items-center justify-center border border-line bg-white p-4 transition-colors hover:border-indigo"
              aria-label={`View certificate ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
              <span className="absolute bottom-3 right-3 grid size-8 place-items-center bg-indigo text-white opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
                <Expand className="size-4" />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={index} onChange={setIndex} label="Certificates" />
    </>
  );
}

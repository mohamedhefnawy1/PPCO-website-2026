"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "./Lightbox";
import { ease } from "./motion/primitives";

export default function Certificates({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {images.map((src, i) => (
          <motion.li
            key={src}
            initial={{ opacity: 0, transform: "translateY(16px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)", transitionEnd: { transform: "none" } }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease, delay: i * 0.05 }}
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="flex aspect-[3/4] w-full items-center justify-center border border-line bg-white p-4 transition-[border-color] duration-200 hover:border-ink"
              aria-label={`View certificate ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
            </button>
          </motion.li>
        ))}
      </ul>
      <Lightbox images={images} index={index} onChange={setIndex} label="Certificates" />
    </>
  );
}

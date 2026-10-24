"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Marquee, MotionToggle } from "./primitives";

type Band = { content: React.ReactNode; speed: number; reverse?: boolean };

/** One or more moving bands that share a visible pause control (hidden when motion is already off). */
export default function PausableBands({
  bands,
  tone = "dark",
  className = "",
  bandsClassName = "",
  label,
}: {
  bands: Band[];
  tone?: "dark" | "light";
  className?: string;
  bandsClassName?: string;
  label?: string;
}) {
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className={className}>
      {!reduce && (
        <div className="wrap flex justify-end">
          <MotionToggle paused={paused} onToggle={() => setPaused((p) => !p)} tone={tone} />
        </div>
      )}
      <div className={bandsClassName} aria-label={label} role={label ? "group" : undefined}>
        {bands.map((b, i) => (
          <Marquee key={i} speed={b.speed} reverse={b.reverse} paused={paused}>
            {b.content}
          </Marquee>
        ))}
      </div>
    </div>
  );
}

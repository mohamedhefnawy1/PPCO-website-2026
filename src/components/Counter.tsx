"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Counts up once when scrolled into view (the source site's counters, done properly). */
export default function Counter({
  value,
  suffix = "",
  className = "",
  suffixClassName = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
  suffixClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(value); // render the real number for no-JS and crawlers

  useEffect(() => {
    if (!reduce && !inView) setN(0); // reset after hydration, before it scrolls into view
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={`tabular ${className}`}>
      {n.toLocaleString("en-US")}
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </span>
  );
}

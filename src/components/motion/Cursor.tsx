"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Pointer companion for mouse users: a small ring that trails the cursor slightly
 * and widens a little over links and buttons. Off for touch and reduced motion.
 * The ring is white with "difference" blending on the fixed root element, so it shows black over
 * white backgrounds and white over black ones. (Blending only works on the root: a blended child
 * of a transformed parent can only mix with that parent, not with the page.)
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 50, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 700, damping: 50, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as Element | null;
      setHover(!!el?.closest?.("a, button, [role=tab], [role=button], input, select, textarea, label"));
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference" style={{ x: sx, y: sy }}>
      <div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-white transition-[width,height] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ width: hover ? 28 : 14, height: hover ? 28 : 14 }}
      />
    </motion.div>
  );
}

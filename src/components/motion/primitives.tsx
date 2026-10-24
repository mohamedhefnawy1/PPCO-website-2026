"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts content into place when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "p";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, transform: `translateY(${y}px)` }}
      whileInView={{ opacity: 1, transform: "translateY(0px)", transitionEnd: { transform: "none" } }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </M>
  );
}

/** Staggers its direct <Item> children into view. */
export function Stagger({ children, className = "", gap = 0.08 }: { children: React.ReactNode; className?: string; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export const item = {
  hidden: { opacity: 0, transform: "translateY(28px)" },
  show: { opacity: 1, transform: "translateY(0px)", transitionEnd: { transform: "none" }, transition: { duration: 0.8, ease } },
};

/** Heading that fades and rises into place as one line when it scrolls into view. */
export function RevealText({
  text,
  className = "",
  delay = 0,
  as = "h2",
  immediate = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  immediate?: boolean;
}) {
  const Tag = motion[as];
  const shown = { opacity: 1, transform: "translateY(0px)", transitionEnd: { transform: "none" } };
  const anim = immediate ? { animate: shown } : { whileInView: shown, viewport: { once: true, margin: "-10% 0px" } };
  return (
    <Tag className={className} initial={{ opacity: 0, transform: "translateY(16px)" }} {...anim} transition={{ duration: 0.8, ease, delay }}>
      {text}
    </Tag>
  );
}

/** Image frame that wipes open and settles from a slight zoom when it enters view. */
export function ImageReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}) {
  const from = { up: "inset(100% 0% 0% 0%)", left: "inset(0% 100% 0% 0%)", right: "inset(0% 0% 0% 100%)" }[direction];
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: from }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.2, ease, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ transform: "scale(1.06)" }}
        whileInView={{ transform: "scale(1)" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.6, ease, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Moves its content against the scroll for depth. `strength` is in percent of the element height. */
export function Parallax({ children, strength = 12, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y: reduce ? 0 : y, scale: reduce ? 1 : 1 + strength / 50 }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Words brighten one by one as the paragraph scrolls through the viewport. */
export function ScrollText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 70%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </span>
    </p>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, [0.25, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

/**
 * Endless horizontal band. Pauses on hover and while focus is inside it,
 * and whenever `paused` is set (for example by a visible pause control).
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
  paused = false,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  paused?: boolean;
  className?: string;
}) {
  return (
    <div className={`group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] ${className}`}>
      {[0, 1].map((k) => (
        <div
          key={k}
          aria-hidden={k === 1}
          className="flex shrink-0 items-center motion-safe:animate-[marquee_var(--d)_linear_infinite] group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused]"
          style={{
            ["--d" as string]: `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
            ...(paused ? { animationPlayState: "paused" } : {}),
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

/** Visible pause / play switch for moving bands (WCAG 2.2.2: motion longer than 5s needs a pause control). */
export function MotionToggle({ paused, onToggle, tone = "dark", className = "" }: { paused: boolean; onToggle: () => void; tone?: "dark" | "light"; className?: string }) {
  const base =
    tone === "light"
      ? "border-white/30 text-white hover:border-white/70 hover:bg-white/10"
      : "border-line text-ink hover:border-ink";
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-[transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.96] ${base} ${className}`}
    >
      {paused ? <PlayIcon /> : <PauseIcon />}
      {paused ? "Play motion" : "Pause motion"}
    </button>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden fill="currentColor">
      <rect x="3.5" y="2.5" width="3" height="11" rx="0.5" />
      <rect x="9.5" y="2.5" width="3" height="11" rx="0.5" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden fill="currentColor">
      <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.2-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" />
    </svg>
  );
}

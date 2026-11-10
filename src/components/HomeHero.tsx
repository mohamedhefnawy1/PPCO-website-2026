"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Marquee, ease } from "./motion/primitives";
import { company, home } from "@/content/site";
import { tc } from "@/lib/text";

const VIDEO = { desktop: "/video/ppco-hero.mp4", mobile: "/video/ppco-hero-mobile.mp4", poster: "/video/ppco-hero-poster.jpg" };

/**
 * Landing hero: the PPCO film plays muted behind the headline, with a frosted-glass strip of
 * client names along the bottom.
 * - A flat 35% black tint darkens the film; black scrims behind the text and the header keep white
 *   text at or above 4.5:1 on the brightest frames (measured against frames of the film).
 * - The film is decorative: it only plays while the hero is on screen and the tab is visible,
 *   and never autoplays for visitors who ask for reduced motion (they see the poster frame).
 */
export default function HomeHero({ clients }: { clients: string[] }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [src, setSrc] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-24%"]);
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Pick the file for the screen size.
  useEffect(() => {
    setSrc(window.matchMedia("(max-width: 767px)").matches ? VIDEO.mobile : VIDEO.desktop);
  }, []);

  // Play only on screen, in a visible tab, and not for reduced-motion visitors, and recover on our own
  // from the ways a background video can fail to start (no refresh needed):
  // - a failed or interrupted download: reload the file (with a cache-busting query, so a broken
  //   cached copy isn't reused), up to 4 times with increasing delays, and again when back online;
  // - a stall (no progress for 8s while it should be playing): treat it like a failed download;
  // - play() refused by the browser (e.g. iOS Low Power Mode): start on the visitor's first tap or key;
  // - play() interrupted before the file was ready: try again as soon as it can play.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src || reduce) return;
    let onScreen = true;
    let attempts = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let lastTime = -1;
    let stalledFor = 0;
    let disposed = false;

    v.defaultMuted = true;
    v.muted = true;
    v.setAttribute("muted", "");

    const wanted = () => onScreen && document.visibilityState === "visible";
    const gestureEvents = ["pointerdown", "keydown", "touchend"] as const;
    const onGesture = () => {
      gestureEvents.forEach((ev) => window.removeEventListener(ev, onGesture));
      tryPlay();
    };
    const tryPlay = () => {
      if (disposed || !wanted()) return;
      v.muted = true;
      v.play().catch((err: DOMException) => {
        if (err?.name === "NotAllowedError") gestureEvents.forEach((ev) => window.addEventListener(ev, onGesture, { once: true, passive: true }));
        // AbortError and friends: the "canplay" listener below retries when the video is ready.
      });
    };
    const sync = () => (wanted() ? tryPlay() : v.pause());

    const reload = () => {
      if (disposed || attempts >= 4) return;
      attempts += 1;
      clearTimeout(retryTimer);
      retryTimer = setTimeout(() => {
        const resumeAt = v.currentTime || 0;
        v.src = `${src}?r=${Date.now()}`;
        v.load();
        if (resumeAt > 0) v.addEventListener("loadedmetadata", () => (v.currentTime = resumeAt), { once: true });
        tryPlay();
      }, 1000 * 2 ** (attempts - 1)); // 1s, 2s, 4s, 8s
    };
    const onError = () => reload();
    const onOnline = () => {
      if (v.error || v.networkState === v.NETWORK_NO_SOURCE) {
        attempts = Math.min(attempts, 3);
        reload();
      } else tryPlay();
    };
    const onPlaying = () => {
      attempts = 0;
      stalledFor = 0;
    };

    // Watchdog: if it should be playing but the picture hasn't moved for 8s, recover.
    const watchdog = setInterval(() => {
      if (!wanted()) return void (stalledFor = 0);
      if (v.currentTime !== lastTime) {
        lastTime = v.currentTime;
        stalledFor = 0;
        return;
      }
      stalledFor += 2;
      if (v.paused && v.readyState >= 3) tryPlay();
      else if (stalledFor >= 8) {
        stalledFor = 0;
        reload();
      }
    }, 2000);

    v.addEventListener("canplay", tryPlay);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("error", onError);
    window.addEventListener("online", onOnline);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    }, { threshold: 0.1 });
    io.observe(v);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      disposed = true;
      clearTimeout(retryTimer);
      clearInterval(watchdog);
      io.disconnect();
      v.removeEventListener("canplay", tryPlay);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("error", onError);
      window.removeEventListener("online", onOnline);
      gestureEvents.forEach((ev) => window.removeEventListener(ev, onGesture));
      document.removeEventListener("visibilitychange", sync);
    };
  }, [src, reduce]);

  return (
    <section ref={ref} aria-label="Introduction" className="relative isolate flex h-[100svh] max-h-[1080px] min-h-[600px] flex-col overflow-hidden bg-night text-white">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ clipPath: "inset(10% 6% 10% 6%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: 1.4, ease }}
      >
        <video
          ref={videoRef}
          src={src ?? undefined}
          poster={VIDEO.poster}
          muted
          loop
          playsInline
          preload={reduce ? "none" : "auto"}
          aria-hidden
          tabIndex={-1}
          className="h-full w-full object-cover"
        />
      </motion.div>
      {/* Black tint over the film, then black scrims behind the header and the text block. The scrim stops
          exactly at the client strip's top edge and drops to 40% beneath it, so the film shows through the glass; client names stay at
          5:1 or better on the brightest frames, measured against blurred frames of the film. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/35" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0)_12%,rgba(0,0,0,0)_15%,rgba(0,0,0,0.9)_calc(100%-3.5rem),rgba(0,0,0,0.4)_calc(100%-3.5rem),rgba(0,0,0,0.4)_100%)] md:bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0)_22%,rgba(0,0,0,0)_30%,rgba(0,0,0,0.85)_calc(100%-3.5rem),rgba(0,0,0,0.4)_calc(100%-3.5rem),rgba(0,0,0,0.4)_100%)]"
      />

      <motion.div style={reduce ? undefined : { y: contentY, opacity: fade }} className="wrap mt-auto pb-10 md:pb-14">
        <motion.h1
          className="heading max-w-[680px] text-4xl leading-[1.1] tracking-[-0.02em] md:text-5xl lg:text-6xl lg:leading-[1.05]"
          initial={{ opacity: 0, transform: "translateY(16px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)", transitionEnd: { transform: "none" } }}
          transition={{ duration: 0.9, ease, delay: 0.3 }}
        >
          {tc(home.hero.title)}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, transform: "translateY(12px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)", transitionEnd: { transform: "none" } }}
          transition={{ duration: 0.8, ease, delay: 0.75 }}
        >
          <p className="mt-5 max-w-[680px] text-base text-white [text-wrap:pretty] md:text-lg">{home.hero.lead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="#vid" className="btn btn-glass-light">
              <PlayCircle className="size-4" aria-hidden /> {home.hero.cta}
            </Link>
            <a
              href={company.profilePdf}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 py-2 text-[0.9375rem] font-medium text-white underline decoration-white/40 underline-offset-[6px] transition-[text-decoration-color] duration-200 hover:decoration-white"
            >
              Company Profile
              <ArrowRight className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5" aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        </motion.div>
      </motion.div>

      {/* Client names on a frosted-glass strip over the bottom of the film */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative flex h-14 items-center border-t border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[20px] backdrop-saturate-[1.8]"
      >
        <p className="hidden h-full shrink-0 items-center border-r border-white/15 px-5 text-xs font-medium uppercase tracking-[0.08em] text-white md:flex md:px-8">
          Trusted by
        </p>
        <div className="min-w-0 flex-1" aria-label="Clients PPCO has worked with" role="group">
          <Marquee speed={40}>
            {[...clients, ...clients].map((c, i) => (
              <span key={i} aria-hidden={i >= clients.length || undefined} className="flex items-center gap-8 whitespace-nowrap pr-8 text-sm font-medium text-white md:text-base">
                {c}
                <span className="h-4 w-px bg-white/30" aria-hidden />
              </span>
            ))}
          </Marquee>
        </div>
      </motion.div>
    </section>
  );
}

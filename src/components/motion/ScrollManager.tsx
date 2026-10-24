"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Height of the fixed header plus breathing room, used when scrolling to a section. */
const headerOffset = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) + 16 || 96;

/** Scroll to the element named in the URL hash; content may still be rendering, so retry briefly. */
function scrollToHash(hash: string, smooth = false, tries = 12) {
  const el = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!el) {
    if (tries > 0) setTimeout(() => scrollToHash(hash, smooth, tries - 1), 60);
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: smooth && !reduce ? "smooth" : "instant" });
}

/**
 * Scroll handling for page changes, on the browser's own (native) scrolling:
 * - a new page always opens at the very top;
 * - a link with a #section opens the new page at that section, below the fixed header;
 * - links that only change the query or #section on the current page scroll there and notify
 *   listeners (the enquiry form and project filters read the new URL);
 * - Back and Forward keep the browser's restored position.
 */
export default function ScrollManager() {
  const pathname = usePathname();
  const first = useRef(true);
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => (popped.current = true);
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname) return;
      // Wait until the router has applied the new URL, then react to it.
      const started = Date.now();
      const wait = () => {
        if (location.href !== url.href && Date.now() - started < 1500) return void setTimeout(wait, 30);
        window.dispatchEvent(new Event("ppco:urlchange"));
        if (url.hash) scrollToHash(url.hash, true);
      };
      setTimeout(wait, 30);
    };
    window.addEventListener("popstate", onPop);
    // Capture phase: Next's <Link> cancels the native click before it would bubble to document.
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (location.hash) scrollToHash(location.hash);
      return;
    }
    if (popped.current) {
      popped.current = false;
      return;
    }
    if (location.hash) {
      scrollToHash(location.hash);
    } else {
      const toTop = () => window.scrollTo({ top: 0, behavior: "instant" });
      toTop();
      // Re-assert once layout has settled (fonts, images and client components mount after this effect).
      requestAnimationFrame(() => requestAnimationFrame(toTop));
    }
  }, [pathname]);

  return null;
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Sticky in-page navigation that highlights the section being read. */
export default function SubNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -55% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  return (
    <div className="sticky top-[var(--header-offset)] z-30 border-b border-line bg-white/95 backdrop-blur transition-[top] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
      <nav aria-label="On this page" className="wrap">
        <ul className="-mx-1 flex gap-1 overflow-x-auto">
          {items.map((i) => (
            <li key={i.id} className="shrink-0">
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? "true" : undefined}
                className={`relative block px-3 py-4 text-[0.95rem] font-medium transition-colors ${
                  active === i.id ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {i.label}
                {active === i.id && (
                  <motion.span layoutId="subnav-active" className="absolute inset-x-3 bottom-0 h-0.5 bg-green" transition={{ duration: 0.3 }} />
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

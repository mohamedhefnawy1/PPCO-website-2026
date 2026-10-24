"use client";

import { useEffect, useState } from "react";

type W = Window & { __ppcoNavigated?: boolean };

/**
 * Page transition: the new page fades in (skipped on the very first load).
 * CSS keyframes, so it stays smooth while the next page loads, and it leaves no transform behind.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [navigated] = useState(() => typeof window !== "undefined" && (window as W).__ppcoNavigated === true);
  useEffect(() => {
    (window as W).__ppcoNavigated = true;
  }, []);
  return <div className={navigated ? "page-enter" : undefined}>{children}</div>;
}

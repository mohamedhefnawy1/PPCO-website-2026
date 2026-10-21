"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronDown, FileText, Menu, PlayCircle, X } from "lucide-react";
import Logo from "./Logo";
import { company, nav } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;
const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);
// Pages that open with a full-width photo banner; the header sits transparently over it.
const BANNER_ROUTES = new Set(["/", "/company", "/projects", "/list-of-equipment", "/list-of-staff-and-manpower", "/training-and-safety", "/services", "/media", "/contact"]);

export default function Header() {
  const pathname = norm(usePathname() || "/");
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 24));
  useEffect(() => {
    setMenu(null);
    setMobile(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const light = BANNER_ROUTES.has(pathname) && !solid && !menu && !mobile; // white text over the page banner
  const isActive = (href: string, children?: readonly { href: string }[]) =>
    pathname === href || !!children?.some((c) => pathname === c.href);

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(label);
  };
  const close = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 120);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        light ? "bg-transparent" : "bg-white shadow-[0_1px_0_0_var(--color-line)]"
      }`}
      onKeyDown={(e) => e.key === "Escape" && setMenu(null)}
    >
      <div className="wrap flex h-20 items-center justify-between gap-8">
        <Link href="/" aria-label="PPCO home" className="shrink-0">
          <Logo white={light} className="h-12" />
        </Link>

        <nav aria-label="Main" className="hidden h-full lg:block">
          <ul className="flex h-full items-center gap-1">
            {nav.map((item) => {
              const children = "children" in item ? item.children : undefined;
              const active = isActive(item.href, children);
              return (
                <li
                  key={item.label}
                  className="relative flex h-full items-center"
                  onMouseEnter={() => children && open(item.label)}
                  onMouseLeave={() => children && close()}
                >
                  {children ? (
                    <button
                      type="button"
                      aria-expanded={menu === item.label}
                      aria-haspopup="true"
                      onClick={() => setMenu(menu === item.label ? null : item.label)}
                      className={`relative flex items-center gap-1 px-4 py-2 text-[0.95rem] font-medium transition-colors ${
                        light ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-ink"
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`size-4 transition-transform ${menu === item.label ? "rotate-180" : ""}`} aria-hidden />
                      {active && <ActiveBar />}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`relative px-4 py-2 text-[0.95rem] font-medium transition-colors ${
                        light ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-ink"
                      }`}
                    >
                      {item.label}
                      {active && <ActiveBar />}
                    </Link>
                  )}

                  <AnimatePresence>
                    {children && menu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease }}
                        className="absolute left-0 top-full w-[540px] border border-line bg-white p-2 shadow-[0_24px_48px_-24px_rgba(22,21,43,0.25)]"
                        onMouseEnter={() => open(item.label)}
                        onMouseLeave={close}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <ul>
                            {children.filter((c) => !("group" in c)).map((c) => (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  className={`block px-4 py-3 text-[0.95rem] transition-colors hover:bg-mist ${
                                    pathname === c.href ? "font-medium text-indigo" : "text-ink"
                                  }`}
                                >
                                  {c.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <div className="bg-mist p-2">
                            <p className="px-2 pb-1 pt-1 text-xs font-medium text-muted">Resources</p>
                            <ul>
                              {children.filter((c) => "group" in c).map((c) => (
                                <li key={c.href}>
                                  <Link
                                    href={c.href}
                                    className={`block px-2 py-2.5 text-[0.95rem] transition-colors hover:text-indigo ${
                                      pathname === c.href ? "font-medium text-indigo" : "text-ink"
                                    }`}
                                  >
                                    {c.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/#vid"
            className={`flex items-center gap-2 px-3 py-2 text-[0.95rem] font-medium ${light ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-ink"}`}
          >
            <PlayCircle className="size-4" aria-hidden /> Company Video
          </Link>
          <a href={company.profilePdf} target="_blank" rel="noreferrer" className={`btn ${light ? "btn-white" : "btn-primary"}`}>
            <FileText className="size-4" aria-hidden /> Company Profile
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobile((v) => !v)}
          className={`grid size-11 place-items-center lg:hidden ${light ? "text-white" : "text-ink"}`}
          aria-label={mobile ? "Close menu" : "Open menu"}
          aria-expanded={mobile}
        >
          {mobile ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobile && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-20 overflow-y-auto bg-white lg:hidden"
          >
            <ul className="wrap py-4">
              {nav.map((item) => (
                <li key={item.label} className="border-b border-line">
                  <Link href={item.href} className="block py-4 text-xl font-medium">
                    {item.label}
                  </Link>
                  {"children" in item && (
                    <ul className="-mt-1 pb-4">
                      {item.children.filter((c) => c.href !== item.href).map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block py-2 pl-4 text-muted">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="wrap flex flex-col gap-3 pb-10">
              <Link href="/#vid" className="btn btn-outline justify-center">
                <PlayCircle className="size-4" aria-hidden /> Company Video
              </Link>
              <a href={company.profilePdf} target="_blank" rel="noreferrer" className="btn btn-primary justify-center">
                <FileText className="size-4" aria-hidden /> Company Profile
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function ActiveBar() {
  return <motion.span layoutId="nav-active" className="absolute inset-x-4 -bottom-0.5 h-0.5 bg-green" transition={{ duration: 0.35, ease }} />;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight, ChevronDown, FileText, Mail, Phone } from "lucide-react";
import Logo from "./Logo";
import { company, nav, quoteHref } from "@/content/site";

const ease = [0.23, 1, 0.32, 1] as const;
const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);
// Pages that open with a full-width photo banner; the header sits transparently over it.
const BANNER_ROUTES = new Set(["/", "/company", "/projects", "/list-of-equipment", "/list-of-staff-and-manpower", "/training-and-safety", "/services", "/media", "/contact"]);

export default function Header() {
  const pathname = norm(usePathname() || "/");
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > 24);
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 240 && y > prev + 2 ? true : y < prev - 2 ? false : hidden);
  });

  // New page: close menus and show the header again.
  useEffect(() => {
    setMenu(null);
    setMobile(false);
    setHidden(false);
  }, [pathname]);

  // Mobile menu open: lock page scroll, make the page behind inert,
  // move focus into the menu, and return it to the toggle when the menu closes.
  useEffect(() => {
    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    if (mobile) {
      document.documentElement.style.overflow = "hidden";
      main?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
      requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("a, button")?.focus());
    } else {
      document.documentElement.style.overflow = "";
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    }
  }, [mobile]);
  const closeMobile = () => {
    setMobile(false);
    toggleRef.current?.focus();
  };

  // Close the mobile menu if the window grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMobile(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Sticky sub-navigation bars follow the header in and out.
  useEffect(() => {
    document.documentElement.style.setProperty("--header-offset", hidden && !menu && !mobile ? "0px" : "var(--header-h)");
  }, [hidden, menu, mobile]);

  const light = BANNER_ROUTES.has(pathname) && !solid && !menu && !mobile; // white text over the page banner
  const isActive = (href: string, children?: readonly { href: string }[]) => pathname === href || !!children?.some((c) => pathname === c.href);

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(label);
  };
  const close = () => {
    closeTimer.current = setTimeout(() => setMenu(null), 120);
  };

  const navText = light ? "text-white/90 hover:text-white" : "text-ink/80 hover:text-ink";

  return (
    <>
      <motion.header
        animate={{ y: hidden && !menu && !mobile ? "-100%" : "0%" }}
        transition={{ duration: 0.45, ease }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color] duration-300 ${light ? "nav-glass" : "nav-glass-light"}`}
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          setMenu(null);
          if (mobile) closeMobile();
        }}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" aria-label="PPCO home" className="shrink-0">
            <Logo white={light} className="h-11 lg:h-14" />
          </Link>

          {/* Desktop navigation */}
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
                        aria-controls={`menu-${item.label}`}
                        onClick={() => setMenu(menu === item.label ? null : item.label)}
                        className={`relative flex items-center gap-1 px-4 py-2 text-[0.95rem] font-medium transition-colors ${navText}`}
                      >
                        {item.label}
                        <ChevronDown className={`size-4 transition-transform duration-200 ${menu === item.label ? "rotate-180" : ""}`} aria-hidden />
                        {active && <ActiveBar />}
                      </button>
                    ) : (
                      <Link href={item.href} aria-current={active ? "page" : undefined} className={`relative px-4 py-2 text-[0.95rem] font-medium transition-colors ${navText}`}>
                        {item.label}
                        {active && <ActiveBar />}
                      </Link>
                    )}

                    <AnimatePresence>
                      {children && menu === item.label && (
                        <motion.div
                          id={`menu-${item.label}`}
                          initial={{ opacity: 0, transform: "translateY(-6px)" }}
                          animate={{ opacity: 1, transform: "translateY(0px)" }}
                          exit={{ opacity: 0, transform: "translateY(-6px)" }}
                          transition={{ duration: 0.18, ease }}
                          className="absolute left-0 top-full w-[540px] border border-line bg-white p-2 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)]"
                          onMouseEnter={() => open(item.label)}
                          onMouseLeave={close}
                        >
                          <div className="grid grid-cols-2 gap-2">
                            <ul>
                              {children.filter((c) => !("group" in c)).map((c) => (
                                <li key={c.href}>
                                  <Link
                                    href={c.href}
                                    aria-current={pathname === c.href ? "page" : undefined}
                                    className={`block px-4 py-3 text-[0.95rem] transition-colors hover:bg-mist ${pathname === c.href ? "font-medium" : ""}`}
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
                                      aria-current={pathname === c.href ? "page" : undefined}
                                      className={`block px-2 py-2.5 text-[0.95rem] underline-offset-4 hover:underline ${pathname === c.href ? "font-medium" : ""}`}
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

          <div className="hidden items-center gap-5 lg:flex">
            <a href={company.profilePdf} target="_blank" rel="noreferrer" className={`flex items-center gap-2 py-2 text-[0.95rem] font-medium transition-colors ${navText}`}>
              <FileText className="size-4" aria-hidden /> Company Profile
              <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
            <Link href={quoteHref()} className={`btn ${light ? "btn-white" : "btn-primary"}`}>
              Request a Quote
            </Link>
          </div>

          {/* Mobile menu toggle: framed so it stays visible over photos and on white */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => (mobile ? closeMobile() : setMobile(true))}
            aria-expanded={mobile}
            aria-controls="mobile-menu"
            className={`flex h-11 items-center gap-2.5 rounded border pl-4 pr-3.5 text-sm font-medium transition-[background-color,border-color,color] duration-200 active:scale-[0.97] lg:hidden ${
              light ? "border-white bg-white text-ink" : "border-line bg-white text-ink hover:border-ink"
            }`}
          >
            <span>{mobile ? "Close" : "Menu"}</span>
            <span aria-hidden className="relative block h-3 w-[18px]">
              <span
                className={`absolute left-0 h-[2px] w-full rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${mobile ? "top-[5px] rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-[2px] w-full rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${mobile ? "top-[5px] -rotate-45" : "top-[10px]"}`}
              />
            </span>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu: outside the header so the header's slide transform can't clip it */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 flex flex-col overflow-y-auto overscroll-contain bg-white lg:hidden"
            onKeyDown={(e) => e.key === "Escape" && closeMobile()}
          >
            <nav aria-label="Mobile" className="wrap flex-1 pt-2">
              <ul>
                {nav.map((item, i) => (
                  <MobileItem key={item.label} item={item} index={i} pathname={pathname} reduce={!!reduce} />
                ))}
              </ul>
            </nav>
            <motion.div
              className="wrap border-t border-line bg-mist py-6"
              initial={reduce ? false : { opacity: 0, transform: "translateY(8px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.3, ease, delay: 0.15 }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Link href={quoteHref()} className="btn btn-primary justify-center">
                  Request a Quote <ArrowRight className="size-4" aria-hidden />
                </Link>
                <a href={company.profilePdf} target="_blank" rel="noreferrer" className="btn btn-outline justify-center bg-white">
                  <FileText className="size-4" aria-hidden /> Company Profile
                <span className="sr-only"> (opens in a new tab)</span></a>
              </div>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <li>
                  <a href={`mailto:${company.email}`} className="inline-flex min-h-11 items-center gap-2">
                    <Mail className="size-4" aria-hidden /> {company.email}
                  </a>
                </li>
                <li>
                  <a href={company.phoneHref} className="inline-flex min-h-11 items-center gap-2">
                    <Phone className="size-4" aria-hidden />
                    <span dir="ltr" className="tabular">
                      {company.phone}
                    </span>
                  </a>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

type NavItem = (typeof nav)[number];

/** One row of the mobile menu; items with sub-pages expand in place. */
function MobileItem({ item, index, pathname, reduce }: { item: NavItem; index: number; pathname: string; reduce: boolean }) {
  const children = "children" in item ? item.children : undefined;
  const active = pathname === item.href || !!children?.some((c) => pathname === c.href);
  const [open, setOpen] = useState(active && !!children);
  const row = "flex min-h-16 w-full items-center justify-between py-3 text-2xl font-medium tracking-[-0.01em]";
  return (
    <motion.li
      className="border-b border-line"
      initial={reduce ? false : { opacity: 0, transform: "translateY(8px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.3, ease, delay: 0.04 * index }}
    >
      {children ? (
        <>
          <button type="button" aria-expanded={open} aria-controls={`m-${item.label}`} onClick={() => setOpen((o) => !o)} className={row}>
            <span className="flex items-center gap-3">
              {active && <span aria-hidden className="h-5 w-[3px] bg-green" />}
              {item.label}
            </span>
            <ChevronDown className={`size-5 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
          </button>
          <AnimatePresence initial={false}>
            {open && (
              <motion.ul
                id={`m-${item.label}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease }}
                className="overflow-hidden"
              >
                {children.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      aria-current={pathname === c.href ? "page" : undefined}
                      className={`flex min-h-12 items-center pl-4 text-lg ${pathname === c.href ? "font-medium text-ink" : "text-muted"}`}
                    >
                      {pathname === c.href && <span aria-hidden className="mr-3 size-1.5 rounded-full bg-green" />}
                      {c.label}
                    </Link>
                  </li>
                ))}
                <li className="h-3" aria-hidden />
              </motion.ul>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link href={item.href} aria-current={active ? "page" : undefined} className={row}>
          <span className="flex items-center gap-3">
            {active && <span aria-hidden className="h-5 w-[3px] bg-green" />}
            {item.label}
          </span>
          <ArrowRight className="size-5 text-muted" aria-hidden />
        </Link>
      )}
    </motion.li>
  );
}

function ActiveBar() {
  return <motion.span layoutId="nav-active" className="absolute inset-x-4 -bottom-0.5 h-0.5 bg-green" transition={{ duration: 0.3, ease }} />;
}

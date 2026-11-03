"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { manrope } from "@/app/fonts";
import type { ServiceMenuItem } from "@/lib/services";

const NAV = [
  { label: "About Us", href: "/about-us" },
  { label: "Services", href: "/services", menu: true },
  { label: "Our Technology", href: "/our-technology" },
  { label: "Digital Digest", href: "/digital-digest" },
  { label: "Digital Footprint", href: "/digital-footprint" },
  { label: "Contact Us", href: "/contact-us" },
];

const LOGO_WHITE = "/logo-copyrightintegrity.svg";
const LOGO_BLUE = "/logo-copyrightintegrity-blue.svg";

// The sticky bar appears after SHOW_AT and hides again at HIDE_AT (hysteresis).
const SHOW_AT = 120;
const HIDE_AT = 100;

type Variant = "top" | "sticky";

const linkCls =
  "flex items-center gap-1.5 whitespace-nowrap transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";

// Hover only counts for a real mouse; touch users open the menu with the chevron button
const mouseOnly = (fn: () => void) => (e: ReactPointerEvent<HTMLElement>) => {
  if (e.pointerType === "mouse") fn();
};

type BarProps = {
  variant: Variant;
  services: ServiceMenuItem[];
  open: boolean; // mobile menu
  onToggle: () => void;
  onNavigate: () => void;
  menuOpen: boolean; // services dropdown
  onMenuEnter: () => void;
  onMenuLeave: () => void;
  onMenuToggle: () => void;
  onMenuLinkClick: () => void;
};

// One bar (logo + nav + dropdown + mobile menu), rendered once per layer
function HeaderBar({
  variant,
  services,
  open,
  onToggle,
  onNavigate,
  menuOpen,
  onMenuEnter,
  onMenuLeave,
  onMenuToggle,
  onMenuLinkClick,
}: BarProps) {
  const sticky = variant === "sticky";
  const menuId = `mobile-menu-${variant}`;
  const panelId = `services-menu-${variant}`;

  // The dropdown thumbnails sit in a hidden panel at the top of the page, so lazy
  // loading would still fetch them at page load and compete with the hero image.
  // Mount them once the menu is opened, or after the page has been idle for a while.
  const [thumbsReady, setThumbsReady] = useState(false);
  useEffect(() => {
    if (thumbsReady) return;
    if (menuOpen) {
      setThumbsReady(true);
      return;
    }
    const id = window.setTimeout(() => setThumbsReady(true), 4000);
    return () => window.clearTimeout(id);
  }, [menuOpen, thumbsReady]);

  return (
    <>
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-6 py-6 lg:px-12">
        <Link
          href="/"
          aria-label="Copyright Integrity International – Home"
          className="block shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
        >
          {/* Eager (not `priority`): no <link rel="preload">, so the hidden blue logo
              isn't preloaded on every page. Both logos are tiny local SVGs. */}
          <Image
            src={sticky ? LOGO_BLUE : LOGO_WHITE}
            alt="Copyright Integrity International"
            width={474}
            height={95}
            loading="eager"
            className="h-auto w-[160px] lg:w-[180px] xl:w-[200px]"
          />
        </Link>

        <nav
          aria-label="Main"
          className="hidden flex-1 items-center justify-center gap-6 text-[15px] lg:flex xl:gap-10 xl:text-[17px]"
        >
          {NAV.map((item) =>
            item.menu ? (
              // "Services": the word is a normal link; the chevron opens the dropdown.
              // The ::after bridges the gap down to the panel so hover never drops.
              <div
                key={item.label}
                onPointerEnter={mouseOnly(onMenuEnter)}
                onPointerLeave={mouseOnly(onMenuLeave)}
                className="relative flex items-center gap-1 after:absolute after:inset-x-[-12px] after:top-full after:h-8"
              >
                <Link
                  href={item.href}
                  onClick={onMenuLinkClick}
                  className={linkCls}
                >
                  {item.label}
                </Link>
                <button
                  type="button"
                  aria-label="Show services menu"
                  aria-expanded={menuOpen}
                  aria-controls={panelId}
                  onClick={onMenuToggle}
                  className="rounded p-1 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden
                    className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link key={item.label} href={item.href} className={linkCls}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <button
          type="button"
          className="-m-2 p-2 lg:hidden"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label="Toggle menu"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            {open ? (
              <path d="M6 6l12 12M18 6 6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Services dropdown (desktop): full-width panel under the bar */}
      <div
        id={panelId}
        onPointerEnter={mouseOnly(onMenuEnter)}
        onPointerLeave={mouseOnly(onMenuLeave)}
        className={`absolute inset-x-0 top-full hidden transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none lg:block ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="border-t border-slate-200/70 bg-[#FAFBFD] text-[#0a1a3a] shadow-[0_24px_40px_-24px_rgba(10,26,58,0.35)]">
          <div className="mx-auto grid max-w-[1280px] grid-cols-4 px-12 py-8">
            {services.slice(0, 4).map((s, i) => (
              <Link
                key={s._id}
                href={`/services/${s.slug}`}
                onClick={onMenuLinkClick}
                className={`group/svc block px-4 first:pl-0 last:pr-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-blue ${
                  i > 0 ? "border-l border-slate-200" : ""
                }`}
              >
                <span
                  className={`${manrope.className} block text-[15px] font-bold leading-snug text-[#0C2268] transition-colors group-hover/svc:text-brand-blue`}
                >
                  {s.title}
                </span>
                <span className="relative mt-4 block aspect-[512/216] overflow-hidden rounded-xl bg-[#0C225E]">
                  {s.image && thumbsReady && (
                    <Image
                      src={s.image}
                      alt={s.imageAlt || ""}
                      fill
                      sizes="25vw"
                      className="object-cover transition-transform duration-500 group-hover/svc:scale-105 motion-reduce:transition-none"
                    />
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu panel, with the services listed under "Services" */}
      {open && (
        <nav
          id={menuId}
          aria-label="Mobile"
          className={`mx-6 mb-4 flex flex-col gap-4 rounded-xl p-6 text-lg lg:hidden ${
            sticky
              ? "border border-slate-200 bg-white text-[#0a1a3a] shadow-lg"
              : "bg-slate-950/95 text-white"
          }`}
        >
          {NAV.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="transition-opacity hover:opacity-70"
              >
                {item.label}
              </Link>
              {item.menu && (
                <ul className="mt-3 flex flex-col gap-3 border-l border-current/20 pl-4 text-base opacity-80">
                  {services.slice(0, 4).map((s) => (
                    <li key={s._id}>
                      <Link
                        href={`/services/${s.slug}`}
                        onClick={onNavigate}
                        className="transition-opacity hover:opacity-70"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      )}
    </>
  );
}

// Used twice per page when wrapped in <Suspense>: first as the fallback (built-in
// service titles), then again with the real Sanity data once it has streamed in.
// The swap mounts a fresh copy, which is fine: it happens within the first moments
// of the page load.
export default function HeaderClient({
  services,
}: {
  services: ServiceMenuItem[];
}) {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [menu, setMenu] = useState(false);
  const stuckRef = useRef(false);
  const timer = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    clearTimer();
    setMenu(true);
  }, [clearTimer]);

  // Small delay when the mouse leaves, so a quick detour never closes the menu
  const closeMenu = useCallback(
    (delay = 140) => {
      clearTimer();
      if (delay === 0) setMenu(false);
      else timer.current = window.setTimeout(() => setMenu(false), delay);
    },
    [clearTimer],
  );

  // Sticky bar: appears after SHOW_AT, hides at HIDE_AT
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const next = stuckRef.current ? y > HIDE_AT : y > SHOW_AT;
      if (next !== stuckRef.current) {
        stuckRef.current = next;
        setStuck(next);
        setOpen(false); // never leave a menu open on the layer that just left
        setMenu(false);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dropdown: close on Escape and on a click/tap outside the header
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest("[data-header]")) setMenu(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  useEffect(() => clearTimer, [clearTimer]);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  const shared = {
    services,
    onToggle: toggle,
    onNavigate: close,
    onMenuEnter: openMenu,
    onMenuLeave: () => closeMenu(),
    onMenuToggle: () => {
      clearTimer();
      setMenu((v) => !v);
    },
    onMenuLinkClick: () => closeMenu(0),
  };

  return (
    <>
      {/* Layer 1: top of the page, transparent with white text + white logo.
          While the dropdown is open it gets the dark navy band from the design. */}
      <header
        data-header
        inert={stuck}
        className={`absolute inset-x-0 top-0 z-40 text-white transition-colors duration-200 motion-reduce:transition-none ${
          menu && !stuck ? "bg-[#031236]" : "bg-transparent"
        }`}
      >
        <HeaderBar
          variant="top"
          open={open && !stuck}
          menuOpen={menu && !stuck}
          {...shared}
        />
      </header>

      {/* Layer 2: sticky white bar + blue logo (hidden = slid up, transparent, no shadow) */}
      <header
        data-header
        inert={!stuck}
        aria-hidden={!stuck}
        className={[
          "fixed inset-x-0 top-0 z-50 border-b bg-white text-[#0a1a3a]",
          "transition-[transform,opacity,visibility,box-shadow] duration-300 ease-out will-change-transform motion-reduce:transition-none",
          stuck
            ? "visible translate-y-0 border-slate-200 opacity-100 shadow-[0_4px_20px_rgba(10,26,58,0.08)]"
            : "invisible -translate-y-full border-transparent opacity-0 shadow-none",
        ].join(" ")}
      >
        <HeaderBar
          variant="sticky"
          open={open && stuck}
          menuOpen={menu && stuck}
          {...shared}
        />
      </header>
    </>
  );
}

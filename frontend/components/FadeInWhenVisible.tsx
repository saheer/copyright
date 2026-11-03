"use client";

import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
  /** HTML tag to render (default "div"), e.g. as="section" */
  as?: ElementType;
  className?: string;
  /** Extra wait before the animation starts, in ms (handy for staggering cards) */
  delay?: number;
  /** How far the content travels up while fading in, in px */
  y?: number;
};

/**
 * Fades its children in and slides them up a few pixels the first time they
 * scroll into view. It plays once and then stays put.
 *
 * - Content is fully visible in the server HTML, so nothing is hidden if
 *   JavaScript is slow, blocked, or the user prints the page.
 * - Anything already on screen (or scrolled past) when the page loads is NOT
 *   animated, so the hero never flickers.
 * - Visitors who prefer reduced motion get no animation at all.
 * - The animation itself is plain CSS (see "Scroll reveal" in globals.css);
 *   this component only flips a data attribute, so it causes no React re-renders.
 */
export default function FadeInWhenVisible({
  children,
  as: Tag = "div",
  className,
  delay = 0,
  y = 20,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already visible (or already scrolled past): leave it alone
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    // Hide instantly (no transition), then let later changes animate
    el.style.transition = "none";
    el.dataset.reveal = "hidden";
    void el.offsetHeight; // flush styles so the hidden state is applied now
    el.style.transition = "";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "shown";
        observer.disconnect(); // play once
      },
      // fire a little after the top edge enters, so the motion is noticed
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const style = {
    "--reveal-delay": `${delay}ms`,
    "--reveal-y": `${y}px`,
  } as CSSProperties;

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

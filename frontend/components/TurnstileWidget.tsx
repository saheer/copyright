"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Props = {
  siteKey?: string;
  // Change this value to get a fresh challenge (tokens are single-use)
  resetKey?: unknown;
  onToken: (token: string | null) => void;
};

export default function TurnstileWidget({ siteKey, resetKey, onToken }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    if (!siteKey || !box.current || !window.turnstile || widgetId.current)
      return;
    widgetId.current = window.turnstile.render(box.current, {
      sitekey: siteKey,
      theme: "light",
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
    });
  }, [siteKey, onToken]);

  // Render when the script is already loaded (e.g. after client-side navigation)
  useEffect(() => {
    renderWidget();
    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
      widgetId.current = null;
    };
  }, [renderWidget]);

  // Fresh challenge after every submission
  useEffect(() => {
    if (widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
      onToken(null);
    }
  }, [resetKey, onToken]);

  if (!siteKey) {
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        CAPTCHA is not configured (missing NEXT_PUBLIC_TURNSTILE_SITE_KEY).
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
      />
      <div ref={box} className="min-h-[65px]" />
    </>
  );
}

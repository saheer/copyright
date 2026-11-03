"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/actions/subscribe";

const INITIAL: SubscribeState = { status: "idle", message: "", email: "" };

export default function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribe, INITIAL);

  return (
    <form action={formAction} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          E-mail Address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="E-mail Address"
          defaultValue={state.email}
          aria-invalid={state.status === "error"}
          aria-describedby="newsletter-feedback"
          className="h-[52px] w-full flex-1 rounded-full border border-white/15 bg-white/[0.06] px-6 text-[15px] text-white placeholder:text-white/45 backdrop-blur-sm transition-colors focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
        />

        {/* Honeypot: hidden from people and screen readers, bots tend to fill it */}
        <div
          aria-hidden
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor="newsletter-website">Website</label>
          <input
            id="newsletter-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="h-[52px] shrink-0 rounded-full bg-[#45A8E8] px-8 text-[15px] font-semibold text-[#0B2A6B] transition-colors duration-200 hover:bg-[#5DB8F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      {/* Always rendered (fixed height) so the layout doesn't jump when a message appears */}
      <p
        id="newsletter-feedback"
        role="status"
        aria-live="polite"
        className={`mt-4 min-h-[1.5rem] text-sm ${
          state.status === "success"
            ? "text-emerald-300"
            : state.status === "error"
              ? "text-red-300"
              : "text-transparent"
        }`}
      >
        {state.message}
      </p>
    </form>
  );
}

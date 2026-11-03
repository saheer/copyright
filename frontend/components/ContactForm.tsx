"use client";

import { useActionState, useId, useState } from "react";
import { submitEnquiry } from "@/app/actions/enquiry";
import { ENQUIRY_TYPES, INITIAL_ENQUIRY_STATE } from "@/lib/enquiry";
import TurnstileWidget from "@/components/TurnstileWidget";

const labelCls = "mb-2 block text-[13px] font-semibold text-[#0B1F5C]";
const inputCls =
  "w-full rounded-lg border border-[#DCE4F0] bg-[#F5F7FB] px-4 text-[15px] text-[#0B1F5C] placeholder:text-[#7C8BA7] transition-colors focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 aria-[invalid=true]:border-red-400";

function Field({
  uid,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  required,
  defaultValue,
  error,
}: {
  uid: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue: string;
  error?: string;
}) {
  const id = `${uid}-${name}`;
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputCls} h-12`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const uid = useId();
  const [state, formAction, pending] = useActionState(
    submitEnquiry,
    INITIAL_ENQUIRY_STATE,
  );
  const [token, setToken] = useState<string | null>(null);
  const { values, errors } = state;

  return (
    <form
      action={formAction}
      className="rounded-[26px] border border-[#D9E4F0] bg-white p-6 sm:p-8 lg:p-10"
    >
      <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
        <Field
          uid={uid}
          name="name"
          label="Name"
          placeholder="Full name"
          autoComplete="name"
          required
          defaultValue={values.name}
          error={errors.name}
        />
        <Field
          uid={uid}
          name="company"
          label="Company"
          placeholder="Organisation"
          autoComplete="organization"
          defaultValue={values.company}
          error={errors.company}
        />
        <Field
          uid={uid}
          name="email"
          label="Email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          required
          defaultValue={values.email}
          error={errors.email}
        />
        <Field
          uid={uid}
          name="phone"
          label="Phone"
          type="tel"
          placeholder="+1 (000) 000-0000"
          autoComplete="tel"
          defaultValue={values.phone}
          error={errors.phone}
        />
      </div>

      {/* Type of enquiry: radio buttons styled as pills */}
      <fieldset className="mt-6">
        <legend className={labelCls}>Type of Enquiry</legend>
        <div className="flex flex-wrap gap-2.5">
          {ENQUIRY_TYPES.map((t) => {
            const id = `${uid}-type-${t.value}`;
            return (
              <div key={t.value}>
                <input
                  type="radio"
                  id={id}
                  name="type"
                  value={t.value}
                  defaultChecked={values.type === t.value}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className="inline-flex h-[38px] cursor-pointer items-center rounded-full border border-[#D5DFEE] bg-white px-[1.1rem] text-[13.5px] font-medium text-[#0B1F5C] transition-colors hover:border-brand-blue hover:bg-[#EEF3FB] peer-checked:border-brand-blue peer-checked:bg-brand-blue peer-checked:text-white peer-checked:hover:bg-[#123a85] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-blue"
                >
                  {t.label}
                </label>
              </div>
            );
          })}
        </div>
        {errors.type && (
          <p className="mt-1.5 text-[13px] text-red-600">{errors.type}</p>
        )}
      </fieldset>

      <div className="mt-6">
        <label htmlFor={`${uid}-message`} className={labelCls}>
          Message
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={4}
          required
          placeholder="How can we help?"
          defaultValue={values.message}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${uid}-message-error` : undefined}
          className={`${inputCls} min-h-[112px] resize-y py-3`}
        />
        {errors.message && (
          <p
            id={`${uid}-message-error`}
            className="mt-1.5 text-[13px] text-red-600"
          >
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people and screen readers, bots tend to fill it */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={`${uid}-company-website`}>Company website</label>
        <input
          id={`${uid}-company-website`}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Token from the CAPTCHA widget, verified on the server */}
      <input type="hidden" name="captchaToken" value={token ?? ""} />

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <TurnstileWidget
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            resetKey={state}
            onToken={setToken}
          />
          {errors.captcha && (
            <p className="mt-1.5 text-[13px] text-red-600">{errors.captcha}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending || !token}
          className="h-[50px] shrink-0 rounded-full bg-brand-blue px-8 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#123a85] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : "Submit Enquiry"}
        </button>
      </div>

      {/* Always rendered so the layout doesn't jump when a message appears */}
      <p
        role="status"
        aria-live="polite"
        className={`mt-5 min-h-[1.5rem] text-sm ${
          state.status === "success"
            ? "text-emerald-700"
            : state.status === "error"
              ? "text-red-600"
              : "text-transparent"
        }`}
      >
        {state.message}
      </p>
    </form>
  );
}

"use server";

import { randomUUID } from "node:crypto";
import { newsletterClient } from "@/sanity/lib/newsletterClient";
import {
  DEFAULT_GENERAL_EMAIL,
  DEFAULT_REPORT_EMAIL,
  EMAIL_RE,
  EMPTY_VALUES,
  ENQUIRY_TYPES,
  LIMITS,
  type EnquiryField,
  type EnquiryState,
  type EnquiryValues,
} from "@/lib/enquiry";

const SUCCESS = "Thank you! Your enquiry has been sent and we will get back to you shortly.";

const text = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
};

function validate(v: EnquiryValues) {
  const errors: Partial<Record<EnquiryField, string>> = {};

  if (v.name.length < 2) errors.name = "Please enter your full name.";
  else if (v.name.length > LIMITS.name)
    errors.name = `Please keep your name under ${LIMITS.name} characters.`;

  if (v.company.length > LIMITS.company)
    errors.company = `Please keep this under ${LIMITS.company} characters.`;

  if (!v.email) errors.email = "Please enter your email address.";
  else if (v.email.length > LIMITS.email || !EMAIL_RE.test(v.email))
    errors.email = "Please enter a valid email address.";

  if (v.phone && !/^\+?[\d\s().-]{7,25}$/.test(v.phone))
    errors.phone = "Please enter a valid phone number.";

  if (!ENQUIRY_TYPES.some((t) => t.value === v.type))
    errors.type = "Please choose a type of enquiry.";

  if (v.message.length < 10)
    errors.message = "Please tell us a little more (at least 10 characters).";
  else if (v.message.length > LIMITS.message)
    errors.message = `Please keep your message under ${LIMITS.message} characters.`;

  return errors;
}

// Cloudflare Turnstile server-side check. Tokens are single-use.
async function verifyCaptcha(token: string): Promise<"ok" | "failed" | "unavailable"> {
  if (!token) return "failed";
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[enquiry] TURNSTILE_SECRET_KEY is not set");
    return "unavailable";
  }
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success ? "ok" : "failed";
  } catch (error) {
    console.error("[enquiry] captcha verification request failed", error);
    return "unavailable";
  }
}

// 1) Stored in the PRIVATE Sanity dataset (same one as the newsletter subscribers)
async function saveEnquiry(v: EnquiryValues, typeLabel: string) {
  await newsletterClient.create({
    _id: `enquiry.${randomUUID()}`,
    _type: "enquiry",
    ...v,
    typeLabel,
    submittedAt: new Date().toISOString(),
    source: "website",
  });
}

// 2) Emailed through Resend's REST API (no extra npm package needed)
async function sendEnquiryEmail(v: EnquiryValues, typeLabel: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("RESEND_API_KEY / CONTACT_FROM_EMAIL not set");

  const to =
    v.type === "report-piracy"
      ? process.env.CONTACT_REPORT_TO || DEFAULT_REPORT_EMAIL
      : process.env.CONTACT_GENERAL_TO || DEFAULT_GENERAL_EMAIL;

  const subject = `[${typeLabel}] New website enquiry from ${v.name}`.replace(/[\r\n]+/g, " ");
  const body = [
    `Type of enquiry: ${typeLabel}`,
    `Name: ${v.name}`,
    `Company: ${v.company || "-"}`,
    `Email: ${v.email}`,
    `Phone: ${v.phone || "-"}`,
    "",
    "Message:",
    v.message,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    // reply_to = the visitor, so "Reply" in your inbox answers them directly
    body: JSON.stringify({ from, to: [to], reply_to: v.email, subject, text: body }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  // Honeypot: real visitors never see this field, bots usually fill it.
  // Pretend it worked so the bot learns nothing.
  if (text(formData, "company_website") !== "") {
    return { status: "success", message: SUCCESS, errors: {}, values: EMPTY_VALUES };
  }

  const values: EnquiryValues = {
    name: text(formData, "name"),
    company: text(formData, "company"),
    email: text(formData, "email").toLowerCase(),
    phone: text(formData, "phone"),
    type: text(formData, "type") || EMPTY_VALUES.type,
    message: text(formData, "message"),
  };

  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors,
      values,
    };
  }

  const captcha = await verifyCaptcha(text(formData, "captchaToken"));
  if (captcha === "failed") {
    return {
      status: "error",
      message: "Please confirm that you are not a robot and try again.",
      errors: { captcha: "Verification failed. Please try again." },
      values,
    };
  }
  if (captcha === "unavailable") {
    return {
      status: "error",
      message: "The enquiry form is unavailable right now. Please email us directly.",
      errors: {},
      values,
    };
  }

  const typeLabel = ENQUIRY_TYPES.find((t) => t.value === values.type)?.label ?? values.type;
  const [saved, emailed] = await Promise.allSettled([
    saveEnquiry(values, typeLabel),
    sendEnquiryEmail(values, typeLabel),
  ]);
  if (saved.status === "rejected") console.error("[enquiry] could not save", saved.reason);
  if (emailed.status === "rejected") console.error("[enquiry] could not email", emailed.reason);

  // Success if at least one of the two worked, so an enquiry is never silently lost
  if (saved.status === "rejected" && emailed.status === "rejected") {
    return {
      status: "error",
      message: "Something went wrong while sending your enquiry. Please try again in a moment.",
      errors: {},
      values,
    };
  }

  return { status: "success", message: SUCCESS, errors: {}, values: EMPTY_VALUES };
}
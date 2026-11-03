"use server";

import { createHash } from "node:crypto";
import { newsletterClient } from "@/sanity/lib/newsletterClient";

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message: string;
  // Sent back so the input keeps what the visitor typed after an error
  email: string;
};

const THANKS = "Thank you for subscribing!";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  // Honeypot: real visitors never see or fill this field, bots usually do.
  // Pretend it worked so the bot learns nothing.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { status: "success", message: THANKS, email: "" };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { status: "error", message: "Please enter your email address.", email };
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
      email,
    };
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("[newsletter] SANITY_API_WRITE_TOKEN is not set");
    return {
      status: "error",
      message: "Subscriptions are unavailable right now. Please try again later.",
      email,
    };
  }

  try {
    // The document id is derived from the email, so subscribing twice with the
    // same address never creates a duplicate (and the visitor still sees "thanks").
    const id = `subscriber.${createHash("sha256").update(email).digest("hex").slice(0, 40)}`;
    await newsletterClient.createIfNotExists({
      _id: id,
      _type: "subscriber",
      email,
      subscribedAt: new Date().toISOString(),
      source: "home-newsletter-section",
    });
    return { status: "success", message: THANKS, email: "" };
  } catch (error) {
    console.error("[newsletter] could not save subscriber", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again in a moment.",
      email,
    };
  }
}
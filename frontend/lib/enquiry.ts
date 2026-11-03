// Shared between components/ContactForm.tsx (client) and app/actions/enquiry.ts (server).

export const ENQUIRY_TYPES = [
  { value: "business-query", label: "Business Query" },
  { value: "report-piracy", label: "Report Piracy" },
  { value: "got-a-notice", label: "Got a Notice" },
  { value: "other", label: "Other" },
] as const;

export type EnquiryValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  type: string;
  message: string;
};

export type EnquiryField = keyof EnquiryValues | "captcha";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message: string;
  errors: Partial<Record<EnquiryField, string>>;
  // Sent back so the form keeps what the visitor typed after an error
  values: EnquiryValues;
};

export const EMPTY_VALUES: EnquiryValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  type: ENQUIRY_TYPES[0].value,
  message: "",
};

export const INITIAL_ENQUIRY_STATE: EnquiryState = {
  status: "idle",
  message: "",
  errors: {},
  values: EMPTY_VALUES,
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = {
  name: 100,
  company: 150,
  email: 254,
  message: 5000,
} as const;

// Shown until the fields are filled in Sanity
export const DEFAULT_CONTACT_HEADING = "Have an Enquiry?";
export const DEFAULT_CONTACT_DESCRIPTION =
  "Would you like to learn more about our services or report an infringement? Please fill in the appropriate form and we will get back to you shortly.";
export const DEFAULT_GENERAL_EMAIL = "hello@copyrightintegrity.com";
export const DEFAULT_REPORT_EMAIL = "report@copyrightintegrity.com";
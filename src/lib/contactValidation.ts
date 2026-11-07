// Shared by the contact form (instant feedback) and /api/contact (enforcement).

export const INQUIRY_TYPES = [
  { value: "GENERAL", label: "General inquiry" },
  { value: "ORDER_BOOK", label: "Order a book" },
  { value: "TESTIMONY", label: "Share a testimony" },
] as const;

export const INQUIRY_VALUES: string[] = INQUIRY_TYPES.map((t) => t.value);

export function inquiryLabel(value: string) {
  return INQUIRY_TYPES.find((t) => t.value === value)?.label ?? value;
}

/** Forms submitted faster than this after the page loaded are treated as bots. */
export const MIN_FILL_MS = 3000;

export interface ContactFields {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

// The same letter three or more times in a row ("fffff", "hhhh") — keyboard mashing, not words.
const REPEATED_LETTERS = /(\p{L})\1{2,}/iu;
const NAME_PATTERN = /^[\p{L}][\p{L}\s'.-]*$/u;
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const PHONE_CHARS = /^[0-9+\-\s()]+$/;

export function validateField(field: keyof ContactFields, raw: string): string | undefined {
  const value = raw.trim();
  switch (field) {
    case "name": {
      if (!value) return "Please enter your name.";
      if (value.length > 80) return "Name is too long.";
      if (!NAME_PATTERN.test(value)) return "Name can only contain letters, spaces, apostrophes and hyphens.";
      if ((value.match(/\p{L}/gu) ?? []).length < 2) return "Please enter your full name.";
      if (REPEATED_LETTERS.test(value)) return "Please enter a real name.";
      return undefined;
    }
    case "email": {
      if (!value) return "Please enter your email address.";
      if (value.length > 160 || !EMAIL_PATTERN.test(value)) return "Please enter a valid email address, e.g. you@example.com.";
      if (REPEATED_LETTERS.test(value.split("@")[0])) return "Please enter a valid email address.";
      return undefined;
    }
    case "phone": {
      if (!value) return undefined; // optional
      if (!PHONE_CHARS.test(value)) return "Phone number can only contain digits, spaces, +, - and ().";
      const digits = value.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) return "Please enter a valid phone number (7–15 digits).";
      if (/^(\d)\1+$/.test(digits)) return "Please enter a valid phone number.";
      return undefined;
    }
    case "message": {
      if (!value) return "Please write a message.";
      if (value.length < 10 || value.split(/\s+/).length < 2) return "Please write a little more (at least a short sentence).";
      if (value.length > 4000) return "Message is too long (4,000 characters max).";
      if (REPEATED_LETTERS.test(value)) return "Please avoid repeating the same letter over and over.";
      return undefined;
    }
  }
}

export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  for (const key of ["name", "email", "phone", "message"] as const) {
    const error = validateField(key, fields[key] ?? "");
    if (error) errors[key] = error;
  }
  return errors;
}

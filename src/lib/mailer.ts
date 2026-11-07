import nodemailer from "nodemailer";

const CONTACT_RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || "pilgrimsmemoir@gmail.com";

const INQUIRY_LABELS: Record<string, string> = {
  GENERAL: "General Inquiry",
  ORDER_BOOK: "Order a Book",
  TESTIMONY: "Share a Testimony",
};

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string | null;
  country?: string | null;
  inquiryType: string;
  message: string;
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/** Sends the contact form submission to the configured receiver.
 * Silently no-ops (with a console warning) if SMTP env vars aren't set, so local dev
 * without email credentials still works — the message is always saved to the database regardless. */
export async function sendContactEmail(payload: ContactEmailPayload) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      "[mailer] SMTP_HOST/SMTP_USER/SMTP_PASS not configured — skipping email send. Message was still saved to the database."
    );
    return { sent: false };
  }

  const inquiryLabel = INQUIRY_LABELS[payload.inquiryType] ?? payload.inquiryType;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: CONTACT_RECEIVER_EMAIL,
    replyTo: payload.email,
    subject: `[Pilgrim's Memoirs] New ${inquiryLabel} from ${payload.name}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : null,
      payload.country ? `Country: ${payload.country}` : null,
      `Inquiry Type: ${inquiryLabel}`,
      "",
      "Message:",
      payload.message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return { sent: true };
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/mailer";
import { INQUIRY_VALUES, MIN_FILL_MS, validateContact } from "@/lib/contactValidation";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { name, email, phone, country, inquiryType, message, website, startedAt } = body ?? {};

  // Bot traps: the hidden "website" field is only ever filled by bots, and people can't
  // complete the form within MIN_FILL_MS. Pretend success so bots don't adapt.
  const elapsed = Date.now() - Number(startedAt);
  if (website || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateContact({
    name: String(name ?? ""),
    email: String(email ?? ""),
    phone: String(phone ?? ""),
    message: String(message ?? ""),
  });
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Please correct the highlighted fields.", errors }, { status: 400 });
  }

  const cleanEmail = String(email).trim();
  const recent = await prisma.contactMessage.count({
    where: {
      email: { equals: cleanEmail, mode: "insensitive" },
      createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) },
    },
  });
  if (recent >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "You've sent several messages in a short time. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const normalizedInquiryType = INQUIRY_VALUES.includes(inquiryType) ? inquiryType : "GENERAL";

  await prisma.contactMessage.create({
    data: {
      name: String(name).trim().slice(0, 120),
      email: cleanEmail.slice(0, 160),
      phone: phone ? String(phone).trim().slice(0, 40) : null,
      country: country ? String(country).slice(0, 80) : null,
      inquiryType: normalizedInquiryType,
      message: String(message).trim().slice(0, 4000),
    },
  });

  try {
    await sendContactEmail({
      name: String(name),
      email: cleanEmail,
      phone: phone ? String(phone) : null,
      country: country ? String(country) : null,
      inquiryType: normalizedInquiryType,
      message: String(message),
    });
  } catch (err) {
    // The message is already saved — don't fail the request just because email delivery failed.
    console.error("[contact] Failed to send notification email:", err);
  }

  return NextResponse.json({ ok: true });
}

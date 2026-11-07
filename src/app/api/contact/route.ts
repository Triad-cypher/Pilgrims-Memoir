import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactEmail } from "@/lib/mailer";

const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;
const INQUIRY_TYPES = ["GENERAL", "ORDER_BOOK", "TESTIMONY"];

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { name, email, phone, country, inquiryType, message } = body ?? {};

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  if (phone && !PHONE_PATTERN.test(String(phone))) {
    return NextResponse.json(
      { error: "Phone number can only contain digits, spaces, +, - and ()." },
      { status: 400 }
    );
  }

  const normalizedInquiryType = INQUIRY_TYPES.includes(inquiryType) ? inquiryType : "GENERAL";

  await prisma.contactMessage.create({
    data: {
      name: String(name).slice(0, 120),
      email: String(email).slice(0, 160),
      phone: phone ? String(phone).slice(0, 40) : null,
      country: country ? String(country).slice(0, 80) : null,
      inquiryType: normalizedInquiryType,
      message: String(message).slice(0, 4000),
    },
  });

  try {
    await sendContactEmail({
      name: String(name),
      email: String(email),
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

import { NextResponse } from "next/server";
import { getSession } from "@/lib/getSession";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ useBlob: Boolean(process.env.BLOB_READ_WRITE_TOKEN) });
}

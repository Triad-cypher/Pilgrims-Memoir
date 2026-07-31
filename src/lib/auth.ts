const SESSION_COOKIE = "pm_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface SessionPayload {
  adminId: string;
  email: string;
  name: string;
  exp: number;
}

export async function createSessionToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const full: SessionPayload = { ...payload, exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 };
  const body = base64UrlEncode(new TextEncoder().encode(JSON.stringify(full)));
  const key = await hmacKey(getSecret());
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const sig = base64UrlEncode(new Uint8Array(signature));
  return `${body}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const key = await hmacKey(getSecret());
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(sig),
      new TextEncoder().encode(body)
    );
    if (!valid) return null;
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(body))) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS };

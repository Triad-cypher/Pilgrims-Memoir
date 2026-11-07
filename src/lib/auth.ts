const SESSION_COOKIE = "pm_session";
// Sliding idle timeout: every authenticated CMS request re-issues the session for another
// SESSION_IDLE_SECONDS, so an admin is signed out after this long with no activity.
const SESSION_IDLE_SECONDS = 15 * 60;

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
  const full: SessionPayload = { ...payload, exp: Date.now() + SESSION_IDLE_SECONDS * 1000 };
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
    // Reject tokens issued with a longer lifetime than the idle window (e.g. old 7-day sessions).
    if (payload.exp - Date.now() > (SESSION_IDLE_SECONDS + 60) * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_IDLE_SECONDS,
};

/** Re-issues the session with a fresh idle window (keeps the admin signed in while active). */
export async function renewSessionToken(session: SessionPayload): Promise<string> {
  return createSessionToken({ adminId: session.adminId, email: session.email, name: session.name });
}

export { SESSION_COOKIE, SESSION_IDLE_SECONDS };

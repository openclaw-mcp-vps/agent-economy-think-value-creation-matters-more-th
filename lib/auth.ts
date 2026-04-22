import crypto from "crypto";
import { cookies } from "next/headers";

export const ACCESS_COOKIE_NAME = "agent_value_access";
const accessDurationDays = 30;

type TokenPayload = {
  email: string;
  exp: number;
};

function getSigningSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || "dev_access_secret_change_me";
}

function base64url(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function parseBase64url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
}

export function createAccessToken(email: string) {
  const expiresAt = Date.now() + accessDurationDays * 24 * 60 * 60 * 1000;
  const payload: TokenPayload = {
    email: email.trim().toLowerCase(),
    exp: expiresAt
  };

  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAccessToken(token?: string | null): TokenPayload | null {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expected = sign(encodedPayload);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const payload = JSON.parse(parseBase64url(encodedPayload)) as TokenPayload;
    if (!payload.email || !payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function getAccessSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  return verifyAccessToken(token);
}

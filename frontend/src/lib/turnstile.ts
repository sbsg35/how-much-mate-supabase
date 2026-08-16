import "server-only";

import { env } from "@/lib/envlib";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    const result = (await response.json()) as { success: boolean };
    return result.success === true;
  } catch (error) {
    console.error("[turnstile.verifyTurnstileToken] Verification request failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

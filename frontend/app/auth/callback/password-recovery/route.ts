import { createSsrClient } from "@/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createSsrClient(cookies());
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    // Confirming a Supabase recovery link verifies an unverified email address.
    // Only allow password selection once Auth reports that confirmation.
    if (!error && data.user.email_confirmed_at) {
      return NextResponse.redirect(
        new URL("/auth/reset-password", requestUrl.origin),
      );
    }

    console.error(
      "Error during password recovery callback:",
      error ?? new Error("Recovery email was not verified"),
    );
  }

  const loginUrl = new URL("/auth/login", requestUrl.origin);
  loginUrl.searchParams.set("alert", "auth_callback_error");
  return NextResponse.redirect(loginUrl);
}

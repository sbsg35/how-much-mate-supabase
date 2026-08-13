// ROUTE
import { createSsrClient } from "@/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams, origin } = requestUrl;
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");
  const next =
    requestedNext?.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/user/profile";

  if (code) {
    const supabase = createSsrClient(cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const redirectUrl = new URL(next, origin);
      return NextResponse.redirect(redirectUrl);
    }

    console.error("Error during auth callback:", error);
  }

  const loginUrl = new URL("/auth/login", origin);
  loginUrl.searchParams.set("alert", "auth_callback_error");
  return NextResponse.redirect(loginUrl);
}

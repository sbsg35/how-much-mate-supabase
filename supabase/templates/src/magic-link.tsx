import React from "react";
import { AuthEmailLayout } from "./auth-email-layout";

export function MagicLinkEmail() {
  return (
    <AuthEmailLayout
      eyebrow="Secure sign in"
      title="Welcome back, mate."
      preview="Your secure sign-in link for How Much Mate."
      message="Use the button below to sign in and get back to comparing what things really cost."
      buttonLabel="Sign in to How Much Mate"
      buttonHref="{{ .Link }}"
      tokenPrompt="Or use this one-time code"
      token="{{ .Token }}"
      footer="If you didn’t request this sign-in, you can safely ignore this email. Your account remains secure."
    />
  );
}

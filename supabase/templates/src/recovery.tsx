import React from "react";
import { AuthEmailLayout } from "./auth-email-layout";

export function RecoveryEmail() {
  return (
    <AuthEmailLayout
      eyebrow="Password recovery"
      title="Let’s get you back in."
      preview="Reset your How Much Mate password."
      message="We received a request to reset your password. Use the secure button below to choose a new one."
      buttonLabel="Reset my password"
      buttonHref="{{ .ConfirmationURL }}"
      footer="If you didn’t request a password reset, you can safely ignore this email. Your password will stay unchanged."
    />
  );
}

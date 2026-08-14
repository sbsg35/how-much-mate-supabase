import React from "react";
import { AuthEmailLayout } from "./auth-email-layout";

export function ConfirmationEmail() {
  return (
    <AuthEmailLayout
      eyebrow="One last step"
      preview="Finish setting up your How Much Mate account."
      message="Confirm your email to finish creating your account and start sharing real-world prices with the community."
      buttonLabel="Confirm my email using the secure link"
      buttonHref="{{ .ConfirmationURL }}"
      actionVariant="link"
      actionAfterToken
      tokenPrompt="Or enter this confirmation code"
      token="{{ .Token }}"
      footer="If you didn’t create a How Much Mate account, there’s nothing you need to do."
    />
  );
}

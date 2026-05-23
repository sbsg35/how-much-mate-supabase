"use client";

import { useState } from "react";
import { SignupForm } from "./SignupForm";
import { VerifyForm } from "./VerifyForm";

type Step = "signup" | "verify";

export const SignupMultistep = () => {
  const [step, setStep] = useState<Step>("signup");
  const [signupEmail, setSignupEmail] = useState("");

  const handleSignupSuccess = (email: string) => {
    setSignupEmail(email);
    setStep("verify");
  };

  if (step === "verify") {
    return <VerifyForm email={signupEmail} />;
  }

  return <SignupForm onSuccess={handleSignupSuccess} />;
};

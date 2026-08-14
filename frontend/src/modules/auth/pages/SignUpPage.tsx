"use client";

import { AuthModeSwitcher } from "../components/AuthModeSwitcher";
import { SignupMultistep } from "../components/SignupMultistep";

export const SignUpPage = () => (
  <>
    <AuthModeSwitcher current="sign-up" />
    <SignupMultistep />
  </>
);

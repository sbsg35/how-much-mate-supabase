import { object } from "zod";
import { InferType, stringTrimmed } from "./schema";

export const emailSchema = stringTrimmed({
  required_error: "Email is required",
})
  .email("Email is invalid")
  .toLowerCase();

const passwordSchema = stringTrimmed({ required_error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be 16 characters or less")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const botTokenSchema = stringTrimmed({
  required_error: "Bot token is required",
}).min(1, "Bot token is required");

export const loginSchema = object({
  email: emailSchema,
  botToken: botTokenSchema,
});

export type LoginDto = InferType<typeof loginSchema>;

export const magicTokenSchema = object({
  token: stringTrimmed({ required_error: "Token is required" }),
});

export type MagicTokenDto = InferType<typeof magicTokenSchema>;

export const signupSchema = object({
  email: emailSchema,
  password: passwordSchema,
  botToken: botTokenSchema,
});

export type SignupDto = InferType<typeof signupSchema>;

export const verificationTokenSchema = object({
  token: stringTrimmed({ required_error: "Verification token is required" }),
});

export type VerificationTokenDto = InferType<typeof verificationTokenSchema>;

export const passwordLoginSchema = object({
  email: emailSchema,
  password: stringTrimmed({ required_error: "Password is required" }).min(
    1,
    "Password is required"
  ),
  botToken: botTokenSchema,
});

export type PasswordLoginDto = InferType<typeof passwordLoginSchema>;

export const passwordResetRequestSchema = object({
  email: emailSchema,
  botToken: botTokenSchema,
});

export type PasswordResetRequestDto = InferType<
  typeof passwordResetRequestSchema
>;

export const passwordResetConfirmSchema = object({
  passwordResetToken: stringTrimmed({
    required_error: "Reset token is required",
  }),
  password: passwordSchema,
  botToken: botTokenSchema,
});

export type PasswordResetConfirmDto = InferType<
  typeof passwordResetConfirmSchema
>;

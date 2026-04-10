import { object } from "zod";
import { stringTrimmed, InferType } from "../../lib/schema";

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

export const loginSchema = object({
  email: emailSchema,
  password: passwordSchema,
  botToken: stringTrimmed({
    required_error: "Bot detection verification failed",
  }),
});

export const passwordlessLoginSchema = object({
  email: emailSchema,
  botToken: stringTrimmed({
    required_error: "Bot detection verification failed",
  }),
});

export const forgotPasswordSchema = object({
  email: emailSchema,
  botToken: stringTrimmed({
    required_error: "Bot detection verification failed",
  }),
});

export const signupSchema = object({
  email: emailSchema,
  password: passwordSchema,
  botToken: stringTrimmed({
    required_error: "Bot detection verification failed",
  }),
});

export const resetPasswordSchema = object({
  passwordResetToken: stringTrimmed({
    required_error: "Password reset token is required",
  }),
  password: passwordSchema,
  botToken: stringTrimmed({
    required_error: "Bot detection verification failed",
  }),
});

export type ForgotPasswordDto = InferType<typeof forgotPasswordSchema>;

export type PasswordlessSigninDto = InferType<typeof passwordlessLoginSchema>;

export type LoginDto = InferType<typeof loginSchema>;

export type SignupDto = InferType<typeof signupSchema>;

export type ResetPasswordDto = InferType<typeof resetPasswordSchema>;

import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_ENV: z.enum(["local", "dev", "prod"]),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

const serverEnvSchema = publicEnvSchema.extend({
  SMTP_PASS: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
});

const publicEnv = {
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

export const env = (
  typeof window === "undefined"
    ? serverEnvSchema.parse({
      ...publicEnv,
      SMTP_PASS: process.env.SMTP_PASS,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    })
    : publicEnvSchema.parse(publicEnv)
) as z.infer<typeof serverEnvSchema>;

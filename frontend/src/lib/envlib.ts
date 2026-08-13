import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

const serverEnvSchema = publicEnvSchema.extend({
  APP_ENV: z.enum(["local", "dev", "prod"]),
  SMTP_PASS: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
});

const publicEnv = {
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

export const env = (
  typeof window === "undefined"
    ? serverEnvSchema.parse({
      ...publicEnv,
      APP_ENV: process.env.APP_ENV,
      SMTP_PASS: process.env.SMTP_PASS,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    })
    : publicEnvSchema.parse(publicEnv)
) as z.infer<typeof serverEnvSchema>;

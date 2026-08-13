import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    APP_ENV: process.env.APP_ENV ?? "local",
  },
  turbopack: {
    root: "/Users/ghuman/Sites/how-much-mate-supabase/frontend",
  },
};

export default nextConfig;

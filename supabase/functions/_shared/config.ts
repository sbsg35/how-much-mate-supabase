type AppEnv = "local" | "dev" | "prod";

type AppConfig = {
  frontendUrl: string;
};

const CONFIG: Record<AppEnv, AppConfig> = {
  local: {
    frontendUrl: "http://localhost:3000",
  },
  dev: {
    frontendUrl: "https://dev.howmuchmate.com.au",
  },
  prod: {
    frontendUrl: "https://howmuchmate.com.au",
  },
};

function getAppEnv(): AppEnv {
  const raw = Deno.env.get("APP_ENV");
  if (raw === "local" || raw === "dev" || raw === "prod") return raw;

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const isLocalRuntime = supabaseUrl.includes("127.0.0.1") ||
    supabaseUrl.includes("localhost") || supabaseUrl.includes("kong");

  // Local development can infer local URLs safely even if APP_ENV wasn't passed.
  if (!raw && isLocalRuntime) return "local";

  throw new Error(
    `APP_ENV must be one of "local", "dev", or "prod" — got: ${
      raw ?? "(unset)"
    }. Set it locally via --env-file or in hosted projects via: supabase secrets set APP_ENV=<dev|prod>`,
  );
}

export function getConfig(): AppConfig {
  return CONFIG[getAppEnv()];
}

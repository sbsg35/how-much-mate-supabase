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
  throw new Error(
    `APP_ENV must be one of "local", "dev", or "prod" — got: ${raw ?? "(unset)"}`,
  );
}

export function getConfig(): AppConfig {
  return CONFIG[getAppEnv()];
}

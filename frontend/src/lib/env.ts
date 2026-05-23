export const envConfig = {
  local: {
    API_URL: "http://localhost:5000",
  },
  dev: {
    API_URL: "https://api-dev.howmuchmate.com.au",
  },
  prod: {
    API_URL: "https://api.howmuchmate.com.au",
  },
};

const env = (process.env.NEXT_PUBLIC_APP_ENV ||
  "local") as keyof typeof envConfig;

export const apiUrl = envConfig[env].API_URL;

export const CLOUDFLARE_TURNSTILE_KEY =
  env === "local"
    ? "1x00000000000000000000AA" // Cloudflare's test key that always returns a valid token
    : "0x4AAAAAABdQCglMU9gaRmEr";

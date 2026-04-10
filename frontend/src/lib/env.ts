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

export const CLOUDFLARE_TURNSTILE_KEY = "0x4AAAAAABdQCglMU9gaRmEr";

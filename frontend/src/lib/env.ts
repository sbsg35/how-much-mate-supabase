const env = process.env.NEXT_PUBLIC_APP_ENV || "local";
export const CLOUDFLARE_TURNSTILE_KEY = env === "prod"
  ? "0x4AAAAAABdQCglMU9gaRmEr"
  : "1x00000000000000000000AA"; // Cloudflare's test key that always returns a valid token (used for local & dev)

// Restricts quote search/creation and suburb selection to this launch region
// (matches the suburb.launch_region column). Canberra for all environments.
export const launchRegion = "canberra";

// Shows the "browse categories" section on the landing page. Off by default.
export const showBrowseCategories =
  process.env.NEXT_PUBLIC_SHOW_BROWSE_CATEGORIES === "true";

variable "cloudflare_api_token" {
  description = "Cloudflare API token, supplied via secrets.auto.tfvars. Needs Zone:DNS:Read (and Zone:DNS:Edit once this config manages records, not just imports them), plus Account:Turnstile:Edit for the Turnstile widget."
  type        = string
  sensitive   = true
}

variable "zone_id" {
  description = "Cloudflare zone ID for howmuchmate.com.au."
  type        = string
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the Turnstile widget. Find it on the Cloudflare dashboard overview page for the zone (right-hand sidebar)."
  type        = string
}

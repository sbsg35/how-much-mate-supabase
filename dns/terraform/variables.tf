variable "cloudflare_api_token" {
  description = "Cloudflare API token, supplied via secrets.auto.tfvars. Needs Zone:DNS:Read (and Zone:DNS:Edit once this config manages records, not just imports them)."
  type        = string
  sensitive   = true
}

variable "zone_id" {
  description = "Cloudflare zone ID for howmuchmate.com.au."
  type        = string
}

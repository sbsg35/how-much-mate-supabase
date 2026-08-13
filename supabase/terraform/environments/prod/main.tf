variable "project_name" {
  description = "Name of the Prod Supabase project."
  type        = string
}

variable "organization_id" {
  description = "Supabase organization that owns the Prod project."
  type        = string
}

variable "region" {
  description = "Supabase region for the Prod project."
  type        = string
}

variable "database_password" {
  description = "Initial database password for the Prod project."
  type        = string
  sensitive   = true
}

variable "instance_size" {
  description = "Optional Prod instance size / plan setting."
  type        = string
  default     = null
}

variable "api_settings" {
  description = "Optional Prod API settings object."
  type        = any
  default     = null
}

variable "auth_settings" {
  description = "Optional Prod auth settings object."
  type        = any
  default     = null
}

variable "external_google_secret" {
  description = "Optional Prod Google OAuth client secret."
  type        = string
  sensitive   = true
  default     = null
}

variable "security_captcha_secret" {
  description = "Prod captcha provider secret, supplied via TF_VAR_security_captcha_secret."
  type        = string
  sensitive   = true
  default     = null
}

module "supabase_environment" {
  source = "../../modules/supabase_environment"

  project_name            = var.project_name
  organization_id         = var.organization_id
  region                  = var.region
  database_password       = var.database_password
  instance_size           = var.instance_size
  api_settings            = var.api_settings
  auth_settings           = var.auth_settings
  external_google_secret  = var.external_google_secret
  security_captcha_secret = var.security_captcha_secret
}

variable "project_name" {
  description = "Name of the Supabase project."
  type        = string
}

variable "organization_id" {
  description = "Supabase organization slug or identifier that owns the project."
  type        = string
}

variable "region" {
  description = "Supabase project region."
  type        = string
}

variable "database_password" {
  description = "Initial database password for the Supabase project."
  type        = string
  sensitive   = true
}

variable "instance_size" {
  description = "Optional Supabase instance size / plan setting."
  type        = string
  default     = null
}

variable "api_settings" {
  description = "Optional API settings object that will be JSON-encoded for supabase_settings.api."
  type        = any
  default     = null
}

variable "auth_settings" {
  description = "Optional auth settings object that will be JSON-encoded for supabase_settings.auth."
  type        = any
  default     = null
}

variable "external_google_secret" {
  description = "Optional Google OAuth client secret to inject into auth_settings.external_google_secret."
  type        = string
  sensitive   = true
  default     = null
}

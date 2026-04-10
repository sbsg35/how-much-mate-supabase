variable "supabase_access_token" {
  description = "Supabase personal access token"
  type        = string
  sensitive   = true
}

variable "supabase_organization_id" {
  description = "Supabase organization ID that owns the project"
  type        = string
}

variable "project_name" {
  description = "Name of the Supabase project"
  type        = string
}

variable "database_password" {
  description = "Initial database password for the project"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "Supabase project region"
  type        = string
}

variable "plan" {
  description = "Supabase project plan"
  type        = string
  default     = "free"
}

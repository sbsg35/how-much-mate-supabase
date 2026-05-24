terraform {
  required_version = ">= 1.5.0"

  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

resource "supabase_project" "this" {
  name              = var.project_name
  organization_id   = var.organization_id
  region            = var.region
  database_password = var.database_password
  instance_size     = var.instance_size
}

resource "supabase_settings" "this" {
  count = var.api_settings == null && var.auth_settings == null ? 0 : 1

  project_ref = supabase_project.this.id
  api         = var.api_settings == null ? null : jsonencode(var.api_settings)
  auth = var.auth_settings == null ? null : jsonencode(
    merge(
      var.auth_settings,
      var.external_google_secret == null ? {} : {
        external_google_secret = var.external_google_secret
      }
    )
  )
}

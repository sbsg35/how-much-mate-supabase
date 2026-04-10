terraform {
  required_version = ">= 1.6.0"

  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

provider "supabase" {
  access_token = var.supabase_access_token
}

resource "supabase_project" "this" {
  organization_id   = var.supabase_organization_id
  name              = var.project_name
  database_password = var.database_password
  region            = var.region
  plan              = var.plan
}

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }

  backend "s3" {
    bucket                      = "terraform-state"
    key                         = "dev/terraform.tfstate" # "dev/terraform.tfstate" for dev
    region                      = "ap-southeast-2"
    endpoint                    = "https://ghhzavhcgldjqdanjxgp.storage.supabase.co/storage/v1/s3"
    force_path_style            = true
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_metadata_api_check     = true
  }
}

provider "supabase" {}

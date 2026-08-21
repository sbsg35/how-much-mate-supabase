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
    key                         = "prod/terraform.tfstate" # "prod/terraform.tfstate" for prod
    region                      = "ap-southeast-2"
    endpoint                    = "https://azcljaelnifkgxfefkvu.storage.supabase.co/storage/v1/s3"
    force_path_style            = true
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_metadata_api_check     = true
  }
}

provider "supabase" {}

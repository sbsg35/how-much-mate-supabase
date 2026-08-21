terraform {
  required_version = ">= 1.5.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket                      = "terraform-state"
    key                         = "cloudflare/terraform.tfstate"
    region                      = "ap-southeast-2"
    endpoint                    = "https://azcljaelnifkgxfefkvu.storage.supabase.co/storage/v1/s3"
    force_path_style            = true
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_metadata_api_check     = true
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

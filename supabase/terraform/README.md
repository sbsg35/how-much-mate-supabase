# Terraform

This workspace now uses one reusable module and one directory per environment:

```text
modules/supabase_environment/
environments/dev/
environments/prod/
```

Each environment directory owns its own provider config and local state file. Keep non-secret environment values in `terraform.tfvars`, and put environment secrets in a local `secrets.auto.tfvars` file. Terraform loads this file automatically, and `.gitignore` excludes it from Git.

Create `secrets.auto.tfvars` in the environment directory before running Terraform:

```hcl
database_password       = "your-database-password"
external_google_secret  = "your-google-oauth-client-secret"
security_captcha_secret = "your-turnstile-secret"
```

Use the credentials for the environment you are deploying. The Supabase access token authenticates the provider, so continue to supply it through the `SUPABASE_ACCESS_TOKEN` environment variable.

## Dev

```sh
cd environments/dev
terraform init
SUPABASE_ACCESS_TOKEN="your-supabase-access-token" terraform plan
SUPABASE_ACCESS_TOKEN="your-supabase-access-token" terraform apply
```

## Prod

```sh
cd environments/prod
terraform init
SUPABASE_ACCESS_TOKEN="your-supabase-access-token" terraform plan
SUPABASE_ACCESS_TOKEN="your-supabase-access-token" terraform apply
```

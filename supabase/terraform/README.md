# Terraform

This workspace now uses one reusable module and one directory per environment:

```text
modules/supabase_environment/
environments/dev/
environments/prod/
```

Each environment directory owns its own provider config. State is stored remotely in a Supabase Storage bucket (`terraform-state`) via its S3-compatible API, keyed per environment (`dev/terraform.tfstate`, `prod/terraform.tfstate`). Keep non-secret environment values in `terraform.tfvars`, and put environment secrets in a local `secrets.auto.tfvars` file. Terraform loads this file automatically, and `.gitignore` excludes it from Git.

Create `secrets.auto.tfvars` in the environment directory before running Terraform:

```hcl
database_password       = "your-database-password"
external_google_secret  = "your-google-oauth-client-secret"
security_captcha_secret = "your-turnstile-secret"
smtp_password           = "your-custom-smtp-password"
```

Custom SMTP's non-secret settings belong in the environment's `auth_settings`
object in `terraform.tfvars`. Keep `smtp_password` in the ignored
`secrets.auto.tfvars`; the module sends it to Supabase as `smtp_pass`.
As with other Terraform-managed credentials, the SMTP password is stored in
Terraform state, so keep the environment's local state file protected.

Use the credentials for the environment you are deploying. The Supabase access token authenticates the provider, so continue to supply it through the `SUPABASE_ACCESS_TOKEN` environment variable.

The `s3` backend needs its own credentials to read/write state, for every command that touches state (`init`, `plan`, `apply`, etc.), not just once. Export the dedicated Storage S3 key (Supabase dashboard → Project Settings → Storage → S3 Connection; named `terraform-state` there) as standard AWS env vars before running Terraform:

```sh
export AWS_ACCESS_KEY_ID="your-supabase-s3-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-supabase-s3-secret-access-key"
```

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

Prod is still on the `local` backend pending migration to the same `s3` backend as dev.

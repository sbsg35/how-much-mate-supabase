# Terraform (Cloudflare DNS)

Manages DNS records for `howmuchmate.com.au` in Cloudflare. State is stored remotely
in the same Supabase Storage bucket (`terraform-state`) used by [../../supabase/terraform](../../supabase/terraform),
keyed as `cloudflare/terraform.tfstate`.

Fill in `zone_id` in `terraform.tfvars` (non-secret, checked into Git). Create a local
`secrets.auto.tfvars` (gitignored, loaded automatically by Terraform) with:

```hcl
cloudflare_api_token = "your-cloudflare-api-token"
```

The token needs `Zone:DNS:Read` + `Zone:Read` scoped to this zone to import existing
records; add `Zone:DNS:Edit` once this config is also used to manage records going
forward.

The `s3` backend needs its own credentials for every command that touches state
(`init`, `plan`, `apply`, etc.). Export the dedicated Storage S3 key for the prod
Supabase project (Supabase dashboard -> Project Settings -> Storage -> S3 Connection)
as standard AWS env vars:

```sh
export AWS_ACCESS_KEY_ID="your-supabase-s3-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-supabase-s3-secret-access-key"
```

## Importing the existing zone

This directory starts empty (no `cloudflare_dns_record` resources yet). The existing
records already live in Cloudflare, so pull them in with
[cf-terraforming](https://github.com/cloudflare/cf-terraforming) rather than
hand-transcribing a zone export — it reads the live API and produces config that
matches reality, including fields (proxied, TTL, priority) that a BIND zone file
doesn't capture.

```sh
go install github.com/cloudflare/cf-terraforming/cmd/cf-terraforming@latest

export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
export CLOUDFLARE_ZONE_ID="your-zone-id"

cf-terraforming generate --resource-type "cloudflare_dns_record" --zone "$CLOUDFLARE_ZONE_ID" > dns_records.tf
cf-terraforming import --resource-type "cloudflare_dns_record" --zone "$CLOUDFLARE_ZONE_ID" > imports.tf
```

If `cf-terraforming import` prints `terraform import` commands instead of `import`
blocks, convert them to Terraform 1.5+ `import { to = ..., id = ... }` blocks so the
one-time import is declarative and reviewable in git.

Then:

```sh
terraform init
terraform plan
```

The plan should show no changes (aside from cosmetic diffs) once the generated config
matches the live zone. Resolve any drift before ever running `apply`. Once the import
is applied, delete `imports.tf` — it's only needed once.

## Importing the existing Turnstile widget

The Turnstile widget behind quote submission/auth already exists in Cloudflare (site key
`0x4AAAAAABdQCglMU9gaRmEr`, referenced in `frontend/src/lib/env.ts`). Import it the same
way as the DNS zone above rather than hand-writing the resource — `mode`, `domains`, and
`bot_fight_mode` need to match the live widget exactly, or `terraform apply` will try to
change it.

Fill in `cloudflare_account_id` in `terraform.tfvars` first (Cloudflare dashboard -> select
the zone -> right sidebar -> "Account ID"). The API token also needs `Account:Turnstile:Edit`
added to its scopes (see `variables.tf`).

```sh
export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"

cf-terraforming generate --account "$CLOUDFLARE_ACCOUNT_ID" --resource-type "cloudflare_turnstile_widget" > turnstile.tf
cf-terraforming import --account "$CLOUDFLARE_ACCOUNT_ID" --resource-type "cloudflare_turnstile_widget" --modern-import-block > imports_turnstile.tf
```

Then:

```sh
terraform init
terraform plan
```

The plan should show no changes once the generated config matches the live widget. As with
the DNS import, resolve any drift before running `apply`, and delete `imports_turnstile.tf`
once the one-time import has been applied.

## Usage

```sh
terraform init
terraform plan
terraform apply
```

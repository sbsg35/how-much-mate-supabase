# Terraform

This workspace now uses one reusable module and one directory per environment:

```text
modules/supabase_environment/
environments/dev/
environments/prod/
```

Each environment directory owns its own provider config and local state file. Keep non-secret environment values in `terraform.tfvars`, and keep secrets out of Git.

## Dev

```sh
cd environments/dev
terraform init
SUPABASE_ACCESS_TOKEN="your-supabase-access-token" TF_VAR_database_password="your-database-password" terraform plan
SUPABASE_ACCESS_TOKEN="your-supabase-access-token" TF_VAR_database_password="your-database-password" terraform apply
```

## Prod

```sh
cd environments/prod
terraform init
SUPABASE_ACCESS_TOKEN="your-supabase-access-token" TF_VAR_database_password="your-database-password" terraform plan
SUPABASE_ACCESS_TOKEN="your-supabase-access-token" TF_VAR_database_password="your-database-password" terraform apply
```

If you prefer a local secrets file, copy `secrets.auto.tfvars.example` into the environment directory you are using and rename it to `secrets.auto.tfvars`. Terraform automatically loads that file, and `.gitignore` excludes it.

# How Much Mate

How Much Mate is a Next.js application backed by Supabase. This repository
contains the frontend, database migrations and seed data, email templates, and
infrastructure configuration.

## Repository structure

```text
.
├── frontend/             Next.js application
├── supabase/
│   ├── migrations/       Database migrations
│   ├── templates/        Supabase email templates
│   ├── terraform/        Remote infrastructure configuration
│   ├── config.toml       Local Supabase configuration
│   └── seed.sql          Local seed data
└── package.json          Supabase and email-template scripts
```

## Prerequisites

- Node.js 24 or later
- Docker
- Supabase CLI (available through the root package dependencies)

## Quick start

1. Install the root and frontend dependencies:

   ```bash
   npm install
   npm --prefix frontend install
   ```

2. Create the frontend environment file:

   ```bash
   cp frontend/.env.example frontend/.env
   ```

3. Start the local Supabase services:

   ```bash
   npx supabase start
   ```

4. Copy the local publishable and secret keys shown by the following command
   into `frontend/.env`:

   ```bash
   npx supabase status
   ```

5. Generate the local database types:

   ```bash
   npm run supabase:types
   ```

6. Start the frontend:

   ```bash
   npm --prefix frontend run dev
   ```

The application will be available at <http://localhost:3000>. Supabase Studio
is at <http://localhost:54323>, and locally captured email is available in
Mailpit at <http://localhost:54324>.

## Local development

### Supabase services

```bash
npx supabase start       # Start the local Supabase stack
npx supabase status      # Show local service URLs and keys
npx supabase stop        # Stop the local Supabase stack
npm run supabase:restart # Rebuild email templates and restart Supabase
```

### Database migrations

Use migrations for every schema change:

```bash
npx supabase migration new <migration_name> # Create an empty migration
npx supabase db diff -f <migration_name>    # Generate one from local changes
npm run supabase:reset                      # Rebuild locally and regenerate types
npx supabase db reset --linked                       # Rebuild the linked remote database
```

A typical workflow is:

1. Make schema changes in a migration or in local Supabase Studio.
2. Generate a migration with `npx supabase db diff -f <migration_name>` if the
   changes were made through Studio.
3. Run `npm run supabase:reset` to apply all migrations and seed data from
   scratch.
4. Review the generated SQL and test the frontend.

To update the generated TypeScript types without resetting the database, run:

```bash
npm run supabase:types
```

The generated file is `frontend/src/supabase/database.types.ts`.

### Pulling a remote schema

After linking the intended remote project, pull its schema with:

```bash
npx supabase db pull
```

This creates a local migration representing remote schema changes. Review it
before applying or committing it.

### Email templates

```bash
npm run email:build # Build the Supabase auth email templates once
npm run email:watch # Rebuild templates while editing
```

Local application email uses Mailpit on `127.0.0.1:54325` by default, so it is
captured rather than delivered. SMTP values in `frontend/.env` can override the
local defaults.

When moderation moves a quote to `pending`, the application sends the review
notification synchronously. A delivery failure is logged without removing the
pending quote.

## Remote database workflow

Authenticate and link the target project before running remote commands:

```bash
npx supabase login
npx supabase projects list
npx supabase link --project-ref <project_ref>
```

The root package also provides `npm run link:dev` for the configured development
project. Confirm the linked project before pushing changes:

```bash
npx supabase migration list
npx supabase db push --dry-run
npx supabase db push
npx supabase db push --linked # run it for linked project
npx supabase migration list
```

Use `npx supabase db push --with-seed` only when the remote environment should
also receive the seed data.

To disconnect the repository from a remote project, run:

```bash
npx supabase unlink
```

> [!CAUTION]
> `npx supabase db reset --linked` drops and rebuilds the linked remote database.
> Verify the target project and backups before using it.

## Environment configuration

Start with `frontend/.env.example`. The main settings are:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_ENV` | Selects `local`, `dev`, or `prod` application configuration |
| `APP_URL` | Public application origin |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase key |
| `SUPABASE_SECRET_KEY` | Server-only Supabase key |
| `OPENAI_API_KEY` | Server-only OpenAI API key |
| `SMTP_HOST` | SMTP server; optional when using local Mailpit |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials; provide both when authentication is required |
| `NEXT_PUBLIC_LAUNCH_REGION` | Restricts search and suburb selection to a launch region (e.g. `canberra`); empty allows all of Australia |

Never commit secret or service-role keys. The Supabase URL is selected by
`NEXT_PUBLIC_APP_ENV` in `frontend/src/lib/config.ts`.

### Launch region flag

`NEXT_PUBLIC_LAUNCH_REGION` gates quote search, the suburb autocomplete, and
quote creation/edit to suburbs whose `suburb.launch_region` column matches.
Enforced both server-side (`find_published_quotes`) and in the suburb query,
so it can't be bypassed via a crafted request. To add a new region, backfill
`launch_region` for its suburbs (see the `canberra` example in
`supabase/seed.sql`) and set the env var to match.

## Troubleshooting

- If local services fail to start, make sure Docker is running and retry
  `npx supabase start`.
- Use `npx supabase status` to check local URLs, ports, and keys.
- If the generated database types are stale, run `npm run supabase:types`.
- Disabling email confirmation does not automatically verify existing users.
  Accounts created earlier with unconfirmed email may need to be handled
  separately.

## Further reference

- [Supabase local development documentation](https://supabase.com/docs/guides/local-development)
- [Original setup walkthrough](https://www.youtube.com/watch?v=BceVcpiOlKM)

## Project TODO

- [ ] Finalize local, development, and production environment variables.
- [ ] Add the CAPTCHA secret.
- [ ] Confirm authentication callback URLs for every environment.

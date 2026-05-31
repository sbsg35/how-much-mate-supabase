# Setup

Reference: https://www.youtube.com/watch?v=BceVcpiOlKM

## Prerequisites

- Docker setup
- Supabase CLI installed

## Initial Setup

- `npx supabase init` - Creates a supabase folder

## Local Development

- `npx supabase start` - Downloads the docker images and starts the containers (postgres, auth, storage, functions, etc.)
- `npx supabase stop` - Stops the containers

## Remote Project Setup

- `npx supabase login` - Authenticate with Supabase
- `npx supabase link --project-ref <project ref>` - Connect local folder to remote project (enables running migrations, functions, etc. on production)
- `npx supabase db remote set <connection string>` - Connect cloud database to local (optional)

### Getting migration status

- `npx supabase db remote status` - Shows the status of local vs remote migrations (which ones are pending, etc.)

### Unlink

- `npx supabase unlink` - Disconnect local from remote project (useful if you want to connect to a different project or just work locally without affecting production)

### Get status of remote project

- `npx supabase status` - Shows connection status and environment variables for the linked project

## Database Migrations

The recommended workflow is to create and test migrations locally, then push them to the remote project once verified. This ensures that you can iterate quickly without affecting production data until you're ready.

### Creating Migrations

- `supabase migration new <name>` - Create a blank migration file
  - Manual: Write SQL directly in the file
  - Auto-Diff: Use the local Studio UI (localhost:54323) to create tables/columns, then run `supabase db diff -f <name>` to generate SQL automatically

### Pulling from Remote

We can make changes in the local supabase studio and then pull those changes down to our local environment to test before pushing to production.

- `npx supabase db pull` - Pull current database schema from remote project and create a migration file locally

### Testing Changes

- `supabase db reset` - Re-runs all migrations from scratch to test locally

### Deploying Changes

- `supabase db push` - Push tested migrations to your live Supabase project

## Database Synchronization

- `supabase link --project-ref <your-id>` - Connects local to remote
- `supabase db pull` - Downloads the remote schema
- `supabase db reset` - Applies downloaded schema to local Docker database

## Local keys

Run `npx supbase status`

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

## TODO for dev & prod

- [ ] Add environment variables for local and production
- [ ] Add captcha secret
- [ ] Add redirect URLS for auth/callback

## Quirks

- If you turn off email_confirmations, the user created prior that didn't verify their email will be stuck, since their status is not verified.

## Pushing to dev

```
# check local vs remote migration status
npx supabase migration list

# push local migrations to remote with dry run first to check for errors
npx supabase db push --dry-run

# push local migrations to remote
npx supabase db push

# include seed
npx supabase db push --with-seed

# check local vs remote migration status again to confirm
npx supabase migration list

# push the seed file

```

## Supabase functions

### Local

- `npx supabase functions serve` - Start local server to test functions
- `npx supabase functions deploy <function-name>` - Deploy a function to the linked remote project
- `npx supabase functions list` - List deployed functions in the remote project

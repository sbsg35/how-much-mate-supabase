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

## Database Migrations

### Creating Migrations

- `supabase db migration new <name>` - Create a blank migration file
  - Manual: Write SQL directly in the file
  - Auto-Diff: Use the local Studio UI (localhost:54323) to create tables/columns, then run `supabase db diff -f <name>` to generate SQL automatically

### Pulling from Remote

- `npx supabase db pull` - Pull current database schema from remote project and create a migration file locally

### Testing Changes

- `supabase db reset` - Re-runs all migrations from scratch to test locally

### Deploying Changes

- `supabase db push` - Push tested migrations to your live Supabase project

## Database Synchronization

- `supabase link --project-ref <your-id>` - Connects local to remote
- `supabase db pull` - Downloads the remote schema
- `supabase db reset` - Applies downloaded schema to local Docker database

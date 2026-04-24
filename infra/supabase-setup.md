# Supabase Setup — Financial Planner

Supabase provides our auth, Postgres, and row-level security for the production app. Locally we run the full stack in Docker via the Supabase CLI so feature work doesn't depend on a network round-trip to Frankfurt.

---

## Prerequisites

- **Docker Desktop** (or OrbStack / Colima) running. The CLI spins up Postgres, PostgREST, Auth, Storage, Studio, and Inbucket as containers.
- Supabase CLI is installed as a devDependency — run it with `npx supabase ...` or via the npm scripts below.

## Local development

```bash
# 1. Start the full local stack (Postgres, Auth, Studio, Inbucket…).
npm run db:start

# 2. Inspect connection info + Studio URL.
npm run db:status

# 3. Regenerate TypeScript types after schema changes.
npm run db:types

# 4. Stop everything.
npm run db:stop
```

When `db:start` finishes, `npm run db:status` prints the local URLs. The relevant ones for `.env.local`:

| Variable | Local value |
| -------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL` | `http://127.0.0.1:54321` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | shown by `db:status` |
| `SUPABASE_SERVICE_ROLE_KEY` | shown by `db:status` |

The CLI uses a fixed JWT secret by default, so these keys are stable across `db:start`/`db:stop` cycles (they only change if you change `config.toml`).

### Supabase Studio

Open the URL printed by `db:status` (default: http://127.0.0.1:54323) for a web UI over the local Postgres — table editor, SQL editor, auth user list, storage browser.

### Email testing (Inbucket)

All emails from Auth (magic links, confirmations) are intercepted locally at http://127.0.0.1:54324. Nothing ever leaves your machine in dev.

## Migrations workflow

Single source of truth: the SQL files in `supabase/migrations/`. Never edit tables directly in Studio and forget to capture the change.

### 1. Write a migration

```bash
# After making schema changes in Studio or via a SQL editor against local DB:
npm run db:diff my_migration_name
# → writes supabase/migrations/<timestamp>_my_migration_name.sql with the diff
```

Or write the migration by hand — just create `supabase/migrations/<timestamp>_<name>.sql`. Timestamps must monotonically increase; use `date -u +%Y%m%d%H%M%S` to generate one.

### 2. Apply locally

```bash
npm run db:reset   # drops local DB, re-applies ALL migrations, then runs seed.sql
```

### 3. Regenerate types

```bash
npm run db:types   # writes app/src/types/supabase.ts
```

Commit both the migration file and the regenerated types in the same PR.

### 4. Apply to production (once linked — see next section)

```bash
npm run db:push    # applies unapplied migrations to the linked remote project
```

## Linking the hosted EU project

> **Do this once**, after you've created the Supabase project in `eu-central-1`.

1. Log in to the CLI:
   ```bash
   npx supabase login
   ```
   This opens your browser; approve the CLI's access.

2. Grab the project ref from the Supabase dashboard URL: `https://supabase.com/dashboard/project/<PROJECT_REF>`.

3. Link:
   ```bash
   npx supabase link --project-ref <PROJECT_REF>
   ```
   You'll be prompted for the database password you set when creating the project.

4. Confirm:
   ```bash
   npx supabase projects list
   ```

5. **Authentication → URL Configuration** in the Supabase dashboard:
   - **Site URL**: `https://planner.boombaleia.com`
   - **Redirect URLs** (add all):
     - `https://planner.boombaleia.com/**`
     - `http://127.0.0.1:3000/**`
     - `http://localhost:3000/**`

6. Pull the current remote schema to make sure your local matches before the first push:
   ```bash
   npm run db:pull
   ```
   This creates a migration capturing whatever already exists in the remote project (should be empty for a fresh project).

## Row-Level Security — non-negotiable

**Every table we ever create must have RLS enabled in the same migration that creates it.** The migration template we'll use from M1 onward looks like:

```sql
create table public.scenarios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  plan_inputs jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.scenarios enable row level security;

create policy "scenarios_select_own" on public.scenarios
  for select using (auth.uid() = user_id);

create policy "scenarios_insert_own" on public.scenarios
  for insert with check (auth.uid() = user_id);

create policy "scenarios_update_own" on public.scenarios
  for update using (auth.uid() = user_id);

create policy "scenarios_delete_own" on public.scenarios
  for delete using (auth.uid() = user_id);
```

No exceptions. If a table ever needs a privileged path (admin, service worker), the migration introduces a separate policy for that role — it does not leave RLS disabled.

## Troubleshooting

- **"cannot connect to Docker daemon"** → start Docker Desktop / OrbStack first.
- **Ports already in use** → another Supabase project is running. `npx supabase stop --project-id <other>` or edit port numbers in `supabase/config.toml`.
- **`db:push` says "Remote database is out of sync"** → someone edited the production DB outside of migrations. Run `npm run db:pull` to capture the drift as a migration, review it carefully, then push.
- **`db:types` writes an empty file** → `db:start` isn't running, or you skipped `db:reset` after adding a migration.

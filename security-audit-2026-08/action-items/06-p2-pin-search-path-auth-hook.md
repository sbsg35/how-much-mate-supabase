---
priority: P2
severity: LOW
complexity: Small
status: open
---

# Pin `search_path` on `custom_access_token_hook`

## Location
`supabase/migrations/20260813000100_custom_access_token_hook.sql:1-27`

## Related Supabase object
`public.custom_access_token_hook(jsonb)` function (registered as the Supabase Auth "custom access token" hook)

## Description
`custom_access_token_hook` is `language plpgsql stable` with no `set search_path`. It is not `SECURITY DEFINER`, so it executes with the privileges of the calling role (`supabase_auth_admin`), which limits the practical risk here — but it sits on a trust boundary (it runs automatically on every token issuance and determines the `user_role` claim baked into every JWT). Supabase's own security linter flags auth-hook functions without a pinned `search_path` as a hardening gap, since a mutable search path in a function invoked implicitly by the auth system is a defense-in-depth weak point.

## Impact
Low likelihood — `supabase_auth_admin`'s search path is managed by Supabase itself, and the function body already schema-qualifies its one table reference (`public.user_role`). This is a hardening recommendation, not an active exploit path.

## Remediation
Add `set search_path = ''` to the function definition, matching the pattern already used in `handle_new_user()` and `authorize()`:

```sql
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  claims jsonb;
  user_role public.app_role;
begin
  select role
  into user_role
  from public.user_role
  where user_id = (event->>'user_id')::uuid;
  ...
```

## Confidence
Medium

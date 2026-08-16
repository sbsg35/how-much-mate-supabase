---
priority: P2
severity: LOW / INFO
complexity: Small
status: open
---

# No RLS INSERT/UPDATE policies on the `quote` table

## Location
`supabase/migrations/` (no migration adds an INSERT or UPDATE policy for `quote`)

## Related Supabase object
`quote` table

## Description
RLS is enabled on `quote`, but there is no INSERT or UPDATE policy for the `authenticated` role. This is currently harmless because all writes go through the service-role client (`supabaseAdminServerClient()`) in `frontend/src/modules/quote/actions.ts`, with ownership enforced manually in application code (`.eq("profile_id", user.id)`).

However, it means the authorization model for this core table lives entirely in server-action code rather than the database — RLS provides no defense-in-depth backstop. Any future code path that writes via the anon/authenticated Supabase key would need its own careful review, since the database won't catch a mistake.

## Impact
Not currently exploitable (default-deny with no policy blocks all writes via anon/authenticated keys). Architectural fragility: the safety net that RLS is supposed to provide for this table doesn't exist.

## Remediation
Add explicit owner-scoped INSERT/UPDATE policies on `quote`, mirroring the existing owner-scoped DELETE policy, e.g.:

```sql
create policy "quote_insert_own" on "public"."quote"
as permissive
for insert
to authenticated
with check ((select auth.uid()) = profile_id);

create policy "quote_update_own" on "public"."quote"
as permissive
for update
to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);
```

Note: this does not change current server-action behavior (which uses the service-role key and bypasses RLS regardless) — it only adds a backstop for any future client-side write path.

## Confidence
High

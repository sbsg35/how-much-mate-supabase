---
priority: P2
severity: LOW / INFO
complexity: Small
status: fixed
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

## Resolution
Added migration `supabase/migrations/20260816234432_quote_insert_update_own_policies.sql` with `quote_insert_own` and `quote_update_own` policies.

Went slightly beyond the originally-suggested plain owner check: both policies also require `status <> 'published'` (`= 'pending'` specifically for insert). Reasoning: item `05-p2-remove-unused-browser-quote-writes.md` is still open, and its unused browser-side `createQuote`/`updateQuote` functions in `service/quote.ts` write directly with the anon/authenticated key. If they were ever accidentally wired up before item 05 is done, a plain owner-only policy would let them silently start working and bypass the entire moderation pipeline (Turnstile, rate limiting, AI checks) that only exists in the server action — publishing unmoderated content directly. Blocking `status = 'published'` at the database layer closes that specific risk regardless of application code, with no effect on current behavior since all real writes go through the service-role client anyway.

Verified against the local Supabase instance with a real authenticated-user JWT (not just reading the policy SQL):
- Insert own quote with `status: 'pending'` → **201 Created**
- Insert own quote with `status: 'published'` → **403 Forbidden** (blocked as intended)
- Insert quote with someone else's `profile_id` → **403 Forbidden**
- Update own quote (non-status field) while remaining non-published → **200 OK**
- Update own quote's `status` to `'published'` → **403 Forbidden** (blocked as intended)

Test user and test rows deleted afterward. `select polname, polcmd, ... from pg_policy where polrelid = 'public.quote'::regclass` confirmed the policies are present with the expected `USING`/`WITH CHECK` expressions.

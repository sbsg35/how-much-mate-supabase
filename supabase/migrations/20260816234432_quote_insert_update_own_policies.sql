-- Add owner-scoped INSERT/UPDATE policies on quote.
--
-- Writes currently go exclusively through the service-role client in
-- src/modules/quote/actions.ts, which performs its own ownership checks and
-- runs content moderation (Turnstile, rate limiting, OpenAI moderation, GPT
-- review) before deciding a status. RLS provided no backstop at all for this
-- table's writes: with no INSERT/UPDATE policy, a direct write via the
-- anon/authenticated key was simply denied.
--
-- These policies add that backstop for any future client-side write path,
-- while deliberately never allowing a directly-authenticated write to leave a
-- row as 'published'. That keeps the moderation pipeline as the only route
-- to publication even if a future code path (e.g. a currently-unused browser
-- helper in service/quote.ts) starts writing to `quote` with the
-- authenticated key instead of going through the server action.
create policy "quote_insert_own" on "public"."quote"
as permissive
for insert
to authenticated
with check (
  (select auth.uid()) = profile_id
  and status = 'pending'
);

create policy "quote_update_own" on "public"."quote"
as permissive
for update
to authenticated
using ((select auth.uid()) = profile_id)
with check (
  (select auth.uid()) = profile_id
  and status <> 'published'
);

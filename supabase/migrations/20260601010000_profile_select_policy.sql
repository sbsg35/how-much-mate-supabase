create policy "profile_select_own" on "public"."profile"
as permissive
for select
to authenticated
using ((select auth.uid()) = profile_id);

create policy "profile_update_own" on "public"."profile"
as permissive
for update
to authenticated
using ((select auth.uid()) = profile_id)
with check ((select auth.uid()) = profile_id);

-- Turn on RLS for the RBAC tables. The existing supabase_auth_admin policy on
-- user_role lets the custom access-token hook read role assignments. Regular
-- clients receive no direct access to either table; permission checks go
-- through public.authorize instead.
alter table public.user_role enable row level security;
alter table public.role_permission enable row level security;

revoke all on table public.role_permission from authenticated, anon, public;

-- Moderators and admins need to see every quote, including pending quotes,
-- before making moderation decisions. Existing public and owner read policies
-- continue to work alongside this policy.
create policy "quote_select_with_moderation_permission"
on public.quote
as permissive
for select
to authenticated
using ((select public.authorize('quotes.moderate')));

-- Allow moderators and admins to delete any quote. The existing ownership
-- policy still allows ordinary users to delete their own quotes.
create policy "quote_delete_with_permission"
on public.quote
as permissive
for delete
to authenticated
using ((select public.authorize('quotes.delete_any')));

-- Category reads remain public. These privileges and policy add category
-- creation, editing, and deletion for users with categories.manage.
grant insert, update, delete on table public.category to authenticated;
grant usage, select on sequence public.category_category_id_seq to authenticated;

create policy "category_manage_with_permission"
on public.category
as permissive
for all
to authenticated
using ((select public.authorize('categories.manage')))
with check ((select public.authorize('categories.manage')));

-- Administrators can read all application profiles when managing users.
-- Profile updates and deletions remain limited to the existing owner policies.
create policy "profile_select_with_users_manage_permission"
on public.profile
as permissive
for select
to authenticated
using ((select public.authorize('users.manage')));

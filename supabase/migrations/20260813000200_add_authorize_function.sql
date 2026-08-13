-- Checks whether the current user has a requested application permission.
-- The user's role comes from the custom user_role claim added to their JWT by
-- custom_access_token_hook. That role is matched against role_permission, and
-- the function returns true when the requested permission is assigned to it.
-- SECURITY DEFINER allows this lookup to work without exposing the underlying
-- role_permission table directly to the caller.
create or replace function public.authorize(
  requested_permission public.app_permission
)
returns boolean as $$
declare
  bind_permissions int;
  user_role public.app_role;
begin
  -- Read the role once from the current user's access token.
  select (auth.jwt() ->> 'user_role')::public.app_role into user_role;

  -- Count mappings between that role and the requested permission.
  select count(*)
  into bind_permissions
  from public.role_permission
  where role_permission.permission = requested_permission
    and role_permission.role = user_role;

  return bind_permissions > 0;
end;
$$ language plpgsql stable security definer set search_path = '';

comment on function public.authorize(public.app_permission) is
  'Returns true when the role in the current JWT has the requested application permission.';

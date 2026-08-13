create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_role public.app_role;
begin
  select role
  into user_role
  from public.user_role
  where user_id = (event->>'user_id')::uuid;

  claims := event->'claims';

  if user_role is not null then
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  else
    claims := jsonb_set(claims, '{user_role}', 'null');
  end if;

  event := jsonb_set(event, '{claims}', claims);

  return event;
end;
$$;

grant usage on schema public to supabase_auth_admin;

grant execute
on function public.custom_access_token_hook(jsonb)
to supabase_auth_admin;

revoke execute
on function public.custom_access_token_hook(jsonb)
from authenticated, anon, public;

grant all
on table public.user_role
to supabase_auth_admin;

revoke all
on table public.user_role
from authenticated, anon, public;

create policy "Allow auth admin to read user roles"
on public.user_role
as permissive
for select
to supabase_auth_admin
using (true);

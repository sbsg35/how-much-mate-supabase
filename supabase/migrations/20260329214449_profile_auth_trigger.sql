-- inserts a row into public.profile
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profile (profile_id, email)
  values (new.id, new.email);
  return new;
end;
$$;
-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
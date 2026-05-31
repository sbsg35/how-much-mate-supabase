alter table "public"."quote"
add column if not exists "updated_at" timestamp with time zone not null default now();

alter table "public"."category"
add column if not exists "updated_at" timestamp with time zone not null default now();

alter table "public"."profile"
add column if not exists "updated_at" timestamp with time zone not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_quote_updated_at on public.quote;
create trigger set_quote_updated_at
  before update on public.quote
  for each row execute function public.set_updated_at();

drop trigger if exists set_category_updated_at on public.category;
create trigger set_category_updated_at
  before update on public.category
  for each row execute function public.set_updated_at();

drop trigger if exists set_profile_updated_at on public.profile;
create trigger set_profile_updated_at
  before update on public.profile
  for each row execute function public.set_updated_at();

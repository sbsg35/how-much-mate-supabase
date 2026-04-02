 create table public.profiles (
  user_id uuid not null references auth.users on delete cascade,
  username text unique,
  avatar_url text, -- Optional by default (no 'not null' constraint)

  primary key (user_id),
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;


-- inserts a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (user_id)
  values (new.id);
  return new;
end;
$$;
-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();




CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS suburb (
  suburb_id varchar PRIMARY KEY,
  locality varchar NOT NULL,
  postcode varchar NOT NULL,
  state varchar NOT NULL,
  position geometry(Point, 4326) NOT NULL,
  display_name varchar(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suburb_locality ON suburb (locality);
CREATE INDEX IF NOT EXISTS idx_suburb_postcode ON suburb (postcode);
CREATE INDEX IF NOT EXISTS idx_suburb_state ON suburb (state);
CREATE INDEX IF NOT EXISTS idx_suburb_position ON suburb USING GIST (position);
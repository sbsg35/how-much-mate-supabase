alter table "public"."suburb" enable row level security;


  create policy "Enable read access for all users"
  on "public"."suburb"
  as permissive
  for select
  to public
using (true);




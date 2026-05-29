create table
  "public"."profile" (
    "profile_id" uuid not null,
    "created_at" timestamp
    with
      time zone not null default now (),
      "username" text,
      "email" text not null
  );

alter table "public"."profile" enable row level security;

create table
  "public"."quote" (
    "quote_id" uuid not null default gen_random_uuid (),
    "created_at" timestamp
    with
      time zone not null default now (),
      "suburb_id" character varying not null,
      "profile_id" uuid not null,
      "price" numeric not null,
      "business_name" text not null,
      "completed" boolean default false not null,
      "quote_date" date not null,
      "metadata" jsonb
  );

alter table "public"."quote" enable row level security;

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (profile_id);

CREATE UNIQUE INDEX quote_pkey ON public.quote USING btree (quote_id);

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."quote" add constraint "quote_pkey" PRIMARY KEY using index "quote_pkey";

alter table "public"."profile" add constraint "profile_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_profile_id_fkey";

alter table "public"."quote" add constraint "quote_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES public.profile (profile_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."quote" validate constraint "quote_profile_id_fkey";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant
select
  on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant
update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant
select
  on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant
update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant
select
  on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant
update on table "public"."profile" to "service_role";

grant delete on table "public"."quote" to "authenticated";

grant insert on table "public"."quote" to "authenticated";

grant references on table "public"."quote" to "authenticated";

grant
select
  on table "public"."quote" to "authenticated";

grant trigger on table "public"."quote" to "authenticated";

grant truncate on table "public"."quote" to "authenticated";

grant
update on table "public"."quote" to "authenticated";

grant delete on table "public"."quote" to "service_role";

grant insert on table "public"."quote" to "service_role";

grant references on table "public"."quote" to "service_role";

grant
select
  on table "public"."quote" to "service_role";

grant trigger on table "public"."quote" to "service_role";

grant truncate on table "public"."quote" to "service_role";

grant
update on table "public"."quote" to "service_role";
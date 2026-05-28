drop policy "Enable insert for users based on user_id" on "public"."project";

drop policy "projects_delete_owner_only" on "public"."project";

drop policy "projects_update_owner_only" on "public"."project";

revoke delete on table "public"."project"
from
    "anon";

revoke insert on table "public"."project"
from
    "anon";

revoke references on table "public"."project"
from
    "anon";

revoke
select
    on table "public"."project"
from
    "anon";

revoke trigger on table "public"."project"
from
    "anon";

revoke truncate on table "public"."project"
from
    "anon";

revoke
update on table "public"."project"
from
    "anon";

revoke delete on table "public"."project"
from
    "authenticated";

revoke insert on table "public"."project"
from
    "authenticated";

revoke references on table "public"."project"
from
    "authenticated";

revoke
select
    on table "public"."project"
from
    "authenticated";

revoke trigger on table "public"."project"
from
    "authenticated";

revoke truncate on table "public"."project"
from
    "authenticated";

revoke
update on table "public"."project"
from
    "authenticated";

revoke delete on table "public"."project"
from
    "service_role";

revoke insert on table "public"."project"
from
    "service_role";

revoke references on table "public"."project"
from
    "service_role";

revoke
select
    on table "public"."project"
from
    "service_role";

revoke trigger on table "public"."project"
from
    "service_role";

revoke truncate on table "public"."project"
from
    "service_role";

revoke
update on table "public"."project"
from
    "service_role";

alter table "public"."project"
drop constraint "project_category_id_fkey";

alter table "public"."project"
drop constraint "project_profile_id_fkey";

alter table "public"."quote"
drop constraint "quote_project_id_fkey";

alter table "public"."project"
drop constraint "project_pkey";

drop index if exists "public"."project_pkey";

drop table "public"."project";

alter table "public"."quote"
drop column "project_id";

alter table "public"."quote"
add column "category_id" bigint;

alter table "public"."quote"
add column "description" text not null;

alter table "public"."quote"
add column "title" text not null;

alter table "public"."quote" add constraint "quote_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.category (category_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."quote" validate constraint "quote_category_id_fkey";
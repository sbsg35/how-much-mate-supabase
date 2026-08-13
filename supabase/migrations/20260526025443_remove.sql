alter table "public"."quote"
add column "category_id" bigint;

alter table "public"."quote"
add column "description" text not null;

alter table "public"."quote"
add column "title" text not null;

alter table "public"."quote" add constraint "quote_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.category (category_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."quote" validate constraint "quote_category_id_fkey";
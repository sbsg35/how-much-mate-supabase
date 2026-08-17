alter table "public"."quote"
  add column "confirmed_at" timestamp with time zone not null default now();

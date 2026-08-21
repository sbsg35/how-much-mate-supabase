alter table "public"."quote"
  add column "gst_status" text not null default 'unknown'
  check ("gst_status" in ('included', 'excluded', 'unknown'));

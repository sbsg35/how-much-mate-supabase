alter table "public"."quote" add constraint "quote_suburb_id_fkey" FOREIGN KEY (suburb_id) REFERENCES public.suburb(suburb_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."quote" validate constraint "quote_suburb_id_fkey";



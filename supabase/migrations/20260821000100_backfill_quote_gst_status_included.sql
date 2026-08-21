update "public"."quote" set "gst_status" = 'included';

INSERT INTO public.category (name, slug)
SELECT 'Plastering', 'plastering'
WHERE NOT EXISTS (
  SELECT 1 FROM public.category WHERE slug = 'plastering'
);

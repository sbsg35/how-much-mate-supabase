INSERT INTO public.category (name, slug)
SELECT 'Insulation', 'insulation'
WHERE NOT EXISTS (
  SELECT 1 FROM public.category WHERE slug = 'insulation'
);

INSERT INTO public.category (name, slug)
SELECT 'Asbestos Removal', 'asbestos-removal'
WHERE NOT EXISTS (
  SELECT 1 FROM public.category WHERE slug = 'asbestos-removal'
);

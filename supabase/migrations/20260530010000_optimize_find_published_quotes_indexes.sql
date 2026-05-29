-- Optimize find_published_quotes filtering and sorting paths
create index if not exists quote_published_created_at_idx
on public.quote (created_at desc)
where status = 'published';

create index if not exists quote_published_category_created_at_idx
on public.quote (category_id, created_at desc)
where status = 'published';

create index if not exists quote_published_suburb_created_at_idx
on public.quote (suburb_id, created_at desc)
where status = 'published';

create index if not exists suburb_position_geog_gist_idx
on public.suburb using gist ((position::extensions.geography));

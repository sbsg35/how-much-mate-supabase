CREATE INDEX IF NOT EXISTS idx_quote_search_tsv_published
ON public.quote USING gin (search_tsv)
WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_suburb_geo_position_cast
ON public.suburb USING gist ((position::extensions.geography));

CREATE INDEX IF NOT EXISTS idx_quote_sort_and_filter
ON public.quote (category_id, price ASC, created_at DESC)
WHERE status = 'published';
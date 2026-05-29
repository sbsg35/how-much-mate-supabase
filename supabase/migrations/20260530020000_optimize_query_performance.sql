-- Optimization 1: Update find_published_quotes
--
-- Key changes:
-- a) Exclude `search_tsv` from the returned JSONB. The stored tsvector was being
--    fully serialized and sent on every row even though the client never uses it.
--    This alone is the most likely cause of timeouts.
-- b) Add SECURITY DEFINER so the function can safely be called with the anon key
--    in addition to service_role, without relying on caller permissions.
-- c) Pin search_path for security best practice with SECURITY DEFINER.

create or replace function public.find_published_quotes(
  p_page integer default 1,
  p_limit integer default 10,
  p_keyword text default null,
  p_search_type text default 'state',
  p_state text default null,
  p_category_id bigint default null,
  p_suburb_id varchar default null,
  p_radius_km integer default null,
  p_sort_by text default 'newest'
)
returns table (
  quote jsonb,
  suburb jsonb,
  category jsonb
)
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  v_search_position extensions.geography;
begin
  if p_suburb_id is not null and p_radius_km is not null then
    select position::extensions.geography into v_search_position
    from public.suburb
    where suburb_id = p_suburb_id;
  end if;

  return query
  select
    -- Exclude search_tsv: serialising this stored tsvector was the primary
    -- source of per-row overhead and unnecessary network payload.
    (to_jsonb(q.*) - 'search_tsv') as quote,
    jsonb_build_object(
      'suburb_id', s.suburb_id,
      'locality', s.locality,
      'postcode', s.postcode,
      'state', s.state
    ) as suburb,
    jsonb_build_object(
      'category_id', c.category_id,
      'name', c.name,
      'slug', c.slug
    ) as category
  from public.quote q
  inner join public.category c on c.category_id = q.category_id
  inner join public.suburb s on s.suburb_id = q.suburb_id
  where q.status = 'published'
    and (p_keyword is null or q.search_tsv @@ websearch_to_tsquery('english', p_keyword))
    and (p_category_id is null or q.category_id = p_category_id)
    and (
      (p_suburb_id is not null and p_radius_km is not null and extensions.st_dwithin(s.position::extensions.geography, v_search_position, p_radius_km * 1000)) or
      (p_suburb_id is not null and p_radius_km is null and s.suburb_id = p_suburb_id) or
      (p_suburb_id is null and p_state is not null and s.state = p_state) or
      (p_suburb_id is null and p_state is null)
    )
  order by
    case when p_sort_by = 'price_low' then q.price end asc,
    case when p_sort_by = 'price_high' then q.price end desc,
    case when p_sort_by = 'newest' or p_sort_by is null then q.created_at end desc
  limit (p_limit + 1)
  offset greatest((p_page - 1) * p_limit, 0);
end;
$$;

-- Optimization 2: Index for the default "newest" sort without a category filter.
-- The existing idx_quote_sort_and_filter leads with category_id, so queries that
-- don't filter by category can't use it for ORDER BY created_at DESC. Without
-- this index those queries fall back to a sequential scan + sort.
create index if not exists idx_quote_created_at_published
  on public.quote (created_at desc)
  where status = 'published';

-- Optimization 3: Index on quote.suburb_id for suburb-based queries.
-- The exact-suburb match (s.suburb_id = p_suburb_id) and the radius query both
-- need Postgres to find all quotes belonging to a given suburb. Without this
-- index the join requires a sequential scan of the quote table.
create index if not exists idx_quote_suburb_id_published
  on public.quote (suburb_id)
  where status = 'published';

-- Optimization 4: Index on suburb.state for state-level filtering.
-- State queries (s.state = p_state) previously required a sequential scan.
create index if not exists idx_suburb_state
  on public.suburb (state);

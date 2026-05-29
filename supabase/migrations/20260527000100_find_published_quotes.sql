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
language plpgsql -- Switched to plpgsql to calculate radius position once
stable
as $$
declare
  v_search_position extensions.geography;
begin
  -- 1. Pre-calculate search position if radius search is active to avoid executing it per row
  if p_suburb_id is not null and p_radius_km is not null then
    select position::extensions.geography into v_search_position
    from public.suburb
    where suburb_id = p_suburb_id;
  end if;

  return query
  select
    to_jsonb(q.*) as quote,
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
  -- Changed to INNER JOIN because you are filtering by these tables anyway.
  -- This allows Postgres to optimize the join order.
  inner join public.category c on c.category_id = q.category_id
  inner join public.suburb s on s.suburb_id = q.suburb_id
  where q.status = 'published'
    and (p_keyword is null or q.search_tsv @@ websearch_to_tsquery('english', p_keyword))
    and (p_category_id is null or q.category_id = p_category_id)
    -- Flattened conditional logic for predictable index usage
    and (
      (p_suburb_id is not null and p_radius_km is not null and extensions.st_dwithin(s.position::extensions.geography, v_search_position, p_radius_km * 1000)) or
      (p_suburb_id is not null and p_radius_km is null and s.suburb_id = p_suburb_id) or
      (p_suburb_id is null and p_state is not null and s.state = p_state) or
      (p_suburb_id is null and p_state is null)
    )
  order by
    -- Postgres optimizes split-out order conditions significantly better than unified CASE WHEN statements
    case when p_sort_by = 'price_low' then q.price end asc,
    case when p_sort_by = 'price_high' then q.price end desc,
    case when p_sort_by = 'newest' or p_sort_by is null then q.created_at end desc
  limit (p_limit + 1)
  offset greatest((p_page - 1) * p_limit, 0);
end;
$$;
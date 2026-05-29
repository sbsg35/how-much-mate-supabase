create or replace function public.find_published_quotes(
  p_page integer default 1,
  p_limit integer default 10,
  p_keyword text default null,
  p_search_type text default 'state',
  p_state text default null,
  p_category_id bigint default null,
  p_suburb_id varchar default null,
  p_radius_km integer default null
)
returns table (
  quote jsonb,
  suburb jsonb,
  category jsonb
)
language sql
stable
as $$
  with search_suburb as (
    select s0.position::extensions.geography as search_position
    from public.suburb s0
    where s0.suburb_id = p_suburb_id
  )
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
  left join public.category c on c.category_id = q.category_id
  left join public.suburb s on s.suburb_id = q.suburb_id
  where q.status = 'published'
    and (p_keyword is null or q.search_tsv @@ websearch_to_tsquery('english', p_keyword))
    and (p_category_id is null or q.category_id = p_category_id)
    and (
      case
        when p_suburb_id is not null and p_radius_km is not null then
          extensions.st_dwithin(
            s.position::extensions.geography,
            (select search_position from search_suburb),
            (p_radius_km * 1000)::double precision
          )
        when p_suburb_id is not null and p_radius_km is null then
          s.suburb_id = p_suburb_id
        when p_state is not null then
          s.state = p_state
        else
          true
      end
    )
  order by q.created_at desc
  limit (p_limit + 1)
  offset greatest((p_page - 1) * p_limit, 0);
$$;

grant execute on function public.find_published_quotes(
  integer,
  integer,
  text,
  text,
  text,
  bigint,
  varchar,
  integer
) to anon, authenticated;

alter table "public"."quote"
add column "search_tsv" tsvector generated always as (
    to_tsvector (
        'english',
        coalesce(title, '') || ' ' || coalesce(description, '')
    )
) stored,
add column "status" text not null default 'published';

alter table "public"."quote" add constraint "quote_status_check" check ("status" in ('pending', 'published'));

create index "quote_search_tsv_idx" on "public"."quote" using gin ("search_tsv");
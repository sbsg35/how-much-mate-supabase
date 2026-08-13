alter table "public"."quote"
add column "search_tsv" tsvector generated always as (
    to_tsvector (
        'english',
        coalesce(title, '') || ' ' || coalesce(description, '')
    )
) stored,
add column "status" text not null default 'published',
add column "review_reason" text,
add column "review_source" text;

alter table "public"."quote" add constraint "quote_status_check" check ("status" in ('pending', 'published', 'flagged'));

alter table "public"."quote" add constraint "quote_review_source_check" check (
    "review_source" is null or "review_source" in ('moderation', 'gpt')
);

create index "quote_search_tsv_idx" on "public"."quote" using gin ("search_tsv");
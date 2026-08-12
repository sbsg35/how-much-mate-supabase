create table if not exists "public"."quote_review_action_token" (
    "token_id" uuid not null default gen_random_uuid (),
    "quote_id" uuid not null,
    "action" text not null,
    "expires_at" timestamp with time zone not null,
    "used_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now (),
    constraint "quote_review_action_token_pkey" primary key ("token_id"),
    constraint "quote_review_action_token_quote_id_fkey" foreign key ("quote_id") references "public"."quote" ("quote_id") on delete cascade,
    constraint "quote_review_action_token_action_check" check ("action" in ('published', 'flagged'))
);

create index if not exists "quote_review_action_token_quote_id_idx"
on "public"."quote_review_action_token" ("quote_id");

create index if not exists "quote_review_action_token_expires_at_idx"
on "public"."quote_review_action_token" ("expires_at");

grant select, insert, update, delete
on table public.quote_review_action_token
to service_role;

create schema if not exists "pgmq";

create extension if not exists "pgmq"
with
    schema "pgmq";

select
    pgmq.create ('quote_review');

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

create or replace function public.enqueue_quote_review()
returns trigger
language plpgsql
security definer
set search_path = public, pgmq
as $$
begin
-- the <> means "is not pending"
    if new.status <> 'pending' then
    --  the return new means "don't do anything, just return the new row as is"
        return new;
    end if;

-- the tg_op is the trigger operation, it can be 'INSERT', 'UPDATE', 'DELETE'
    if tg_op = 'INSERT' then
    -- the perform means "execute this function, but ignore the result"
        perform pgmq.send(
            queue_name => 'quote_review',
            msg => jsonb_build_object('quote_id', new.quote_id)
        );
    elsif old.status is distinct from 'pending' then
    -- only send a message if the status changed to pending, not if it was already pending
        perform pgmq.send(
            queue_name => 'quote_review',
            msg => jsonb_build_object('quote_id', new.quote_id)
        );
    end if;

    return new;
end;
$$;

drop trigger if exists enqueue_quote_review_on_pending on public.quote;

-- this trigger will call the enqueue_quote_review function after a quote is inserted or updated to pending status
create trigger enqueue_quote_review_on_pending
after insert or update of status on public.quote
for each row
when (new.status = 'pending')
execute function public.enqueue_quote_review();
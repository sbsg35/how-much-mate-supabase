create schema if not exists "pgmq";

create extension if not exists "pgmq"
with
    schema "pgmq";

select
    pgmq.create ('quote_review');
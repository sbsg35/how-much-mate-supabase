grant usage on schema pgmq to service_role;
grant execute on all functions in schema pgmq to service_role;
grant select, update, delete on table pgmq.q_quote_review to service_role;
grant select, insert, update, delete on table public.quote_review_action_token to service_role;

grant usage on schema pgmq to service_role;
grant execute on all functions in schema pgmq to service_role;
grant select, update on table pgmq.q_quote_review to service_role;

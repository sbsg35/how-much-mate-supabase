create extension if not exists "pg_cron"
with
    schema "pg_catalog";

create extension if not exists "pg_net"
with
    schema "extensions";

select
    cron.schedule(
        'invoke-review-quote-every-minute',
        '* * * * *', -- every minute
        $$
        select
            net.http_post(
                url := (
                    select decrypted_secret
                    from vault.decrypted_secrets
                    where name = 'project_url'
                ) || '/functions/v1/review_quote',
                headers := jsonb_build_object(
                    'Content-Type',
                    'application/json',
                    'apiKey',
                    (
                        select decrypted_secret
                        from vault.decrypted_secrets
                        where name = 'project_secret'
                    )
                ),
                body := jsonb_build_object('trigger', 'cron')
            ) as request_id;
        $$
    );

    
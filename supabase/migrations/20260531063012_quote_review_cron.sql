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
            net.http_get(
                url := (
                    select decrypted_secret
                    from vault.decrypted_secrets
                    where name = 'project_url'
                ) || '/functions/v1/review_quote',
                params := jsonb_build_object('trigger', 'cron'),
                headers := jsonb_build_object(
                    'apikey',
                    (
                        select decrypted_secret
                        from vault.decrypted_secrets
                        where name = 'project_secret'
                    )
                )
            ) as request_id;
        $$
    );

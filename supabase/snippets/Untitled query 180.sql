-- 1) Verify what URL cron is currently using
select name, decrypted_secret
from vault.decrypted_secrets
where name in ('project_url', 'project_secret');

select vault.create_secret('http://host.docker.internal:54321', 'project_url2');


select net.http_get(
  url := (
    select decrypted_secret from vault.decrypted_secrets where name = 'project_url2'
  ) || '/functions/v1/review_quote?trigger=manual-test',
  headers := jsonb_build_object(
    'Authorization',
    'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'project_secret'),
    'apikey',
    (select decrypted_secret from vault.decrypted_secrets where name = 'project_secret')
  )
) as request_id;
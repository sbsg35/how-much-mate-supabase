drop policy if exists "Enable read access for all users" on "public"."quote";

drop policy if exists "quote_select_admin_or_owner" on "public"."quote";

create policy "quote_select_admin_or_owner" on "public"."quote" as permissive for
select
    to authenticated using (
        (
            (
                select
                    auth.uid ()
            ) = profile_id
        )
    );
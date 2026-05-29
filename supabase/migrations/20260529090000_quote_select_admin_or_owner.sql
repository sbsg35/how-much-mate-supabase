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
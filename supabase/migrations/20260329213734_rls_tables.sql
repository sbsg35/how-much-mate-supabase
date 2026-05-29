create policy "Enable delete for users based on user_id" on "public"."quote" as permissive for delete to public using (
  (
    (
      SELECT
        auth.uid () AS uid
    ) = profile_id
  )
);

create policy "Enable insert for authenticated users only" on "public"."quote" as permissive for insert to authenticated
with
  check (
    (
      (
        select
          auth.uid ()
      ) = profile_id
    )
  );

create policy "update_own_quote" on "public"."quote" as permissive for
update to public using (
  (
    (
      select
        auth.uid ()
    ) = profile_id
  )
)
with
  check (
    (
      (
        select
          auth.uid ()
      ) = profile_id
    )
  );
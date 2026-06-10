create policy "Enable delete for users based on user_id" on "public"."quote" as permissive for delete to public using (
  (
    (
      SELECT
        auth.uid () AS uid
    ) = profile_id
  )
);
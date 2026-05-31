"use client";
import { Container, Paper, Title, VisuallyHidden } from "@mantine/core";
import { ProfileForm } from "./components/ProfileForm";
import { SecuritySettingsForm } from "./components/SecuritySettingsForm";
import { ProfilePageSkeleton } from "./components/ProfilePageSkeleton";
import { useProfile } from "@/service/profile";

export const ProfilePage = () => {
  const { data: user, isLoading } = useProfile();

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <Container size="sm">
      {/* for SEO */}
      <VisuallyHidden>
        <Title order={1}>Profile page</Title>
      </VisuallyHidden>
      <Paper withBorder shadow="md" p={30} radius="md" mt="sm" pos="relative">
        {user && <ProfileForm user={user} />}
      </Paper>

      <Paper withBorder shadow="md" p={30} radius="md" mt="sm" pos="relative">
        <SecuritySettingsForm />
      </Paper>
    </Container>
  );
};

"use client";
import { Heading } from "@/components/Heading";
import { Container, Paper, VisuallyHidden } from "@mantine/core";
import { ProfileForm } from "./components/ProfileForm";
import { SecuritySettingsForm } from "./components/SecuritySettingsForm";
import { ProfilePageSkeleton } from "../quote/components/ProfilePageSkeleton";
import { useProfile } from "@/service/profile";
import { AuthNotification } from "../auth/components/AuthNotification";
import { useSearchParams } from "next/navigation";

export const ProfilePage = () => {
  const searchParams = useSearchParams();
  const { data: user, isLoading } = useProfile();
  const alert = searchParams.get("alert");

  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <Container size="sm">
      <AuthNotification type={alert} cleanupPath="/user/profile" />
      {/* for SEO */}
      <VisuallyHidden>
        <Heading level={1}>Profile page</Heading>
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

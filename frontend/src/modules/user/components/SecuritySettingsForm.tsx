import { BodyText } from "@/components/BodyText";
import { Heading } from "@/components/Heading";
import { Button, Flex, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { supabaseBrowserClient } from "@/supabase/client";

export const SecuritySettingsForm = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabaseBrowserClient().auth.signOut();
      router.push("/auth/logged-out");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notifications.show({
        title: "Logout failed",
        message: "Logout failed",
        color: "red",
      });
    }
  };

  const handleLogoutAll = async () => {
    try {
      await supabaseBrowserClient().auth.signOut({ scope: "global" });
      router.push("/auth/logged-out");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notifications.show({
        title: "Logout failed",
        message: "Logout failed",
        color: "red",
      });
    }
  };

  return (
    <>
      <Heading>Security</Heading>
      <Flex align="flex-end" justify="space-between" gap="md" mt="md">
        <Stack gap="0">
          <BodyText>Logout</BodyText>
          <BodyText muted>Sign out from this device. Simple and secure.</BodyText>
        </Stack>
        <Button variant="outline" color="red" size="xs" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
      <Flex align="flex-end" mt="lg" justify="space-between">
        <Stack gap="0">
          <BodyText>Logout all</BodyText>
          <BodyText muted>
            Sign out from all devices you&apos;re logged into.
          </BodyText>
        </Stack>
        <Button
          variant="outline"
          color="red"
          size="xs"
          onClick={handleLogoutAll}
        >
          Logout all
        </Button>
      </Flex>
    </>
  );
};

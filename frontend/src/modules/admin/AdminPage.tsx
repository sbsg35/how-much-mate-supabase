import { BodyText } from "@/components/BodyText";
import { Heading } from "@/components/Heading";
import { Paper, Stack } from "@mantine/core";

export function AdminPage() {
  return (
    <Paper withBorder shadow="sm" p="xl" radius="md" mt="xl">
      <Stack gap="xs">
        <Heading level={1}>Admin</Heading>
        <BodyText muted>This page is only available to administrators.</BodyText>
      </Stack>
    </Paper>
  );
}

import { Paper, Stack, Text, Title } from "@mantine/core";

export function AdminPage() {
  return (
    <Paper withBorder shadow="sm" p="xl" radius="md" mt="xl">
      <Stack gap="xs">
        <Title order={1}>Admin</Title>
        <Text c="dimmed">This page is only available to administrators.</Text>
      </Stack>
    </Paper>
  );
}

import { Heading } from "@/components/Heading";
import {
  Container,
  Paper,
  Skeleton,
  Stack,
  VisuallyHidden,
} from "@mantine/core";

export const ProfilePageSkeleton = () => {
  return (
    <Container size="sm">
      <VisuallyHidden>
        <Heading level={1}>Profile page</Heading>
      </VisuallyHidden>

      <Paper withBorder shadow="md" p={30} radius="md" mt="sm" pos="relative">
        <Stack gap="md">
          <Skeleton height={28} width="35%" radius="sm" />
          <Skeleton height={16} width="55%" radius="sm" />
          <Skeleton height={36} radius="sm" mt="xs" />
          <Skeleton height={34} width={90} radius="sm" />
        </Stack>
      </Paper>

      <Paper withBorder shadow="md" p={30} radius="md" mt="sm" pos="relative">
        <Stack gap="md">
          <Skeleton height={28} width="30%" radius="sm" />
          <Skeleton height={16} width="70%" radius="sm" />
          <Skeleton height={30} width={80} radius="sm" />
        </Stack>
      </Paper>
    </Container>
  );
};

import { Stack, Text, Title } from "@mantine/core";

import { CentredContainer } from "@/components/CentredContainer";

interface ModerationStatusPageProps {
  title: string;
  message: string;
}

export const ModerationStatusPage = ({
  title,
  message,
}: ModerationStatusPageProps) => {
  return (
    <CentredContainer size="sm">
      <Stack gap="md">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={1}>
          How Much Mate moderation
        </Text>
        <Title order={2}>{title}</Title>
        <Text>{message}</Text>
      </Stack>
    </CentredContainer>
  );
};

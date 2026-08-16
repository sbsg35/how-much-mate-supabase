import { Stack } from "@mantine/core";

import { BodyText } from "@/components/BodyText";
import { CentredContainer } from "@/components/CentredContainer";
import { Heading } from "@/components/Heading";

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
        <BodyText size="xs" muted tt="uppercase" fw={700} lts={1}>
          How Much Mate moderation
        </BodyText>
        <Heading>{title}</Heading>
        <BodyText>{message}</BodyText>
      </Stack>
    </CentredContainer>
  );
};

import { Button, Stack, Text, Title } from "@mantine/core";

import { CentredContainer } from "@/components/CentredContainer";

import { ModerationAction, submitModerationAction } from "./actions";

interface ModerationConfirmPageProps {
  tokenId: string;
  quoteTitle: string;
  tokenAction: ModerationAction;
}

export const ModerationConfirmPage = ({
  tokenId,
  quoteTitle,
  tokenAction,
}: ModerationConfirmPageProps) => {
  const isPublish = tokenAction === "published";

  return (
    <CentredContainer size="sm">
      <Stack gap="md">
        <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={1}>
          How Much Mate moderation
        </Text>
        <Title order={2}>Confirm moderation action</Title>
        <Text c="dimmed">
          You are about to{" "}
          <Text span fw={700} c={isPublish ? "green" : "red"}>
            {isPublish ? "Publish" : "Flag"}
          </Text>{" "}
          the following quote:
        </Text>
        <Text fw={600} fz="lg">
          {quoteTitle}
        </Text>
        <form action={submitModerationAction}>
          <input type="hidden" name="tokenId" value={tokenId} />
          <Button
            type="submit"
            fullWidth
            size="lg"
            color={isPublish ? "green" : "red"}
          >
            {isPublish ? "Publish quote" : "Mark as flagged"}
          </Button>
        </form>
      </Stack>
    </CentredContainer>
  );
};

import { Button, Stack, Text } from "@mantine/core";

import { BodyText } from "@/components/BodyText";
import { CentredContainer } from "@/components/CentredContainer";
import { Heading } from "@/components/Heading";

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
        <BodyText size="xs" muted tt="uppercase" fw={700} lts={1}>
          How Much Mate moderation
        </BodyText>
        <Heading>Confirm moderation action</Heading>
        <BodyText muted>
          You are about to{" "}
          <Text span fw={700} c={isPublish ? "green" : "red"}>
            {isPublish ? "Publish" : "Flag"}
          </Text>{" "}
          the following quote:
        </BodyText>
        <BodyText fw={600} size="lg">
          {quoteTitle}
        </BodyText>
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

import { Group, Stack } from "@mantine/core";
import { FC } from "react";
import { BodyText } from "./BodyText";
import { DefaultContainer } from "./DefaultContainer";
import { NextLink } from "./NextLink";

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <DefaultContainer h="100%">
      <Stack align="center" justify="center" gap={2} h="100%">
        <BodyText size="sm" muted>
          © {currentYear} How Much Mate. All rights reserved.
        </BodyText>
        <Group gap="md">
          <NextLink href="/about" size="sm" c="dimmed">
            About
          </NextLink>
          <NextLink href="/privacy" size="sm" c="dimmed">
            Privacy
          </NextLink>
          <NextLink href="/terms" size="sm" c="dimmed">
            Terms
          </NextLink>
        </Group>
      </Stack>
    </DefaultContainer>
  );
};

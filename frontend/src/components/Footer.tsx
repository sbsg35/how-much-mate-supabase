import { Group, Stack, Text } from "@mantine/core";
import { FC } from "react";
import { DefaultContainer } from "./DefaultContainer";
import { NextLink } from "./NextLink";

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <DefaultContainer h="100%">
      <Stack align="center" justify="center" gap={2} h="100%">
        <Text size="sm" c="dimmed">
          © {currentYear} How Much Mate. All rights reserved.
        </Text>
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

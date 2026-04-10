import { Group, Text } from "@mantine/core";
import { FC } from "react";
import { DefaultContainer } from "./DefaultContainer";

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <DefaultContainer h="100%">
      <Group justify="center" h="100%">
        <Text size="sm" c="dimmed">
          © {currentYear} How Much Mate. All rights reserved.
        </Text>
      </Group>
    </DefaultContainer>
  );
};

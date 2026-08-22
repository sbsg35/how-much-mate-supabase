import { Flex, Stack, Text } from "@mantine/core";

export const Logo = () => (
  <Flex align="center" gap={6}>
    <Stack gap={1}>
      <Text
        c="var(--hmw-heading)"
        fw={800}
        fz={21}
        lh={0.9}
        style={{ letterSpacing: "-0.7px" }}
      >
        How Much
      </Text>
      <Text
        c="hmw.6"
        fw={800}
        fz={21}
        lh={0.9}
        style={{ letterSpacing: "-0.7px" }}
      >
        Mate
      </Text>
      <Text
        c="dimmed"
        fz={12}
        lh={1}
        mt={2}
        display={{ base: "none", md: "block" }}
        style={{ whiteSpace: "nowrap" }}
      >
        Community pricing for everyday services
      </Text>
    </Stack>
  </Flex>
);

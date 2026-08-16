import { Flex, Stack, Text } from "@mantine/core";
import Image from "next/image";

export const Logo = () => (
  <Flex align="center" gap={6}>
    <Image
      src="/logo-svg.svg"
      alt="How Much Mate logo"
      width={40}
      height={40}
      style={{ borderRadius: "50%", flexShrink: 0 }}
    />
    <Stack gap={1}>
      <Text
        c="#111111"
        fw={800}
        fz={21}
        lh={0.9}
        style={{ letterSpacing: "-0.7px" }}
      >
        How Much
      </Text>
      <Text
        c="var(--mantine-primary-color-filled)"
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

import { Flex, Box, Text, Stack } from "@mantine/core";
import Image from "next/image";
export const Logo = () => (
  <>
    <Flex align="center" gap="4">
      <Box
        maw="40px"
        mah="40px"
        w="40px"
        h="40px"
        style={{ position: "relative" }}
      >
        <Image
          src="/logo-simple.png"
          alt="How much mate logo"
          style={{ borderRadius: "50%" }}
          sizes="60px"
          fill
        />
      </Box>
      <Stack gap={0}>
        <Text c="hmw" fw="bold" ff="monospace">
          HowMuchMate?
        </Text>
        <Text size="sm" c="dimmed" display={{ base: "none", md: "block" }}>
          Community pricing for everyday services
        </Text>
      </Stack>
    </Flex>
  </>
);

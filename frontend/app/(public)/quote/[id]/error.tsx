"use client";

import { DefaultContainer } from "@/components/DefaultContainer";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconRefresh,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Quote detail page error:", error);
  }, [error]);

  return (
    <DefaultContainer>
      <Stack align="center" gap="lg" py="xl">
        <IconAlertCircle size={64} color="var(--mantine-color-red-6)" />

        <Title order={1} ta="center">
          Quote not found
        </Title>

        <Text size="lg" ta="center" maw={600} mx="auto">
          We couldn&apos;t find the quote you&apos;re looking for. It may have
          been removed or the link might be incorrect.
        </Text>

        <Group>
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={() => reset()}
            variant="filled"
          >
            Try again
          </Button>

          <Button
            component={Link}
            href="/"
            variant="light"
            leftSection={<IconArrowLeft size={16} />}
          >
            Back to quotes
          </Button>
        </Group>
      </Stack>
    </DefaultContainer>
  );
}

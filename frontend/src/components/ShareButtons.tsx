"use client";

import { useState } from "react";
import { Button, Group, Stack, Text, Tooltip } from "@mantine/core";
import {
  IconBrandWhatsapp,
  IconCopy,
  IconShare3,
  IconBrandX,
} from "@tabler/icons-react";

type ShareButtonsProps = {
  title: string;
  shareUrl: string;
};

export const ShareButtons = ({ title, shareUrl }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const shareMessage = `Check out this quote: ${title}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        text: shareMessage,
        url: shareUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const shareText = encodeURIComponent(`${shareMessage} on How Much Mate`);
  const encodedShareUrl = encodeURIComponent(shareUrl);

  return (
    <Stack gap={6} mt="md">
      <Text size="sm" fw={500} c="dimmed">
        Share this quote
      </Text>
      <Group gap="xs" wrap="wrap">
        <Tooltip label="Share" withArrow>
          <Button
            size="compact-sm"
            variant="light"
            leftSection={<IconShare3 size={16} />}
            onClick={handleNativeShare}
          >
            {copied ? "Copied" : "Share"}
          </Button>
        </Tooltip>

        <Tooltip label="Copy link" withArrow>
          <Button
            size="compact-sm"
            variant="outline"
            leftSection={<IconCopy size={16} />}
            onClick={handleCopyLink}
          >
            Copy link
          </Button>
        </Tooltip>

        <Tooltip label="Share on X" withArrow>
          <Button
            size="compact-sm"
            variant="subtle"
            leftSection={<IconBrandX size={16} />}
            component="a"
            href={`https://x.com/intent/post?text=${shareText}&url=${encodedShareUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            X
          </Button>
        </Tooltip>

        <Tooltip label="Share on WhatsApp" withArrow>
          <Button
            size="compact-sm"
            variant="subtle"
            leftSection={<IconBrandWhatsapp size={16} />}
            component="a"
            href={`https://wa.me/?text=${shareText}%20${encodedShareUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </Button>
        </Tooltip>
      </Group>
    </Stack>
  );
};

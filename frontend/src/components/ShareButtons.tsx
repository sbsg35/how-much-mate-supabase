"use client";

import { useState } from "react";
import { Button, Stack, Text } from "@mantine/core";
import {
  IconCheck,
  IconCopy,
  IconShare3,
} from "@tabler/icons-react";

type ShareButtonsProps = {
  title: string;
  shareUrl: string;
};

export const ShareButtons = ({ title, shareUrl }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const shareMessage = `Check out this quote: ${title}`;

  const showCopiedState = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, text: shareMessage, url: shareUrl });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    showCopiedState();
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    showCopiedState();
  };

  return (
    <Stack gap="sm">
      <Text fw={700} c="#202939">
        Share this quote
      </Text>
      <Button
        fullWidth
        size="md"
        leftSection={<IconShare3 size={19} />}
        onClick={handleNativeShare}
      >
        Share this quote
      </Button>
      <Button
        fullWidth
        size="md"
        variant="outline"
        leftSection={copied ? <IconCheck size={19} /> : <IconCopy size={19} />}
        onClick={handleCopyLink}
      >
        {copied ? "Link copied" : "Copy link"}
      </Button>
    </Stack>
  );
};

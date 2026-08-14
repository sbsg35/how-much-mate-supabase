"use client";

import { useState } from "react";
import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import type { CSSProperties } from "react";
import {
  IconBookmark,
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconBrandX,
  IconCheck,
  IconCopy,
  IconLink,
  IconMail,
  IconShare3,
} from "@tabler/icons-react";

type ShareButtonsProps = {
  title: string;
  shareUrl: string;
};

const socialButtonStyle: CSSProperties = {
  display: "inline-flex",
  width: 38,
  height: 38,
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  color: "var(--mantine-color-hmw-7)",
  border: "1px solid #dfe6e3",
  borderRadius: "50%",
  background: "#ffffff",
  cursor: "pointer",
};

export const ShareButtons = ({ title, shareUrl }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
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

  const handleSave = () => {
    setSaved((currentSaved) => !currentSaved);
  };

  const shareText = encodeURIComponent(`${shareMessage} on How Much Mate`);
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const socialLinks = [
    {
      label: "Copy link",
      icon: <IconLink size={18} />,
      onClick: handleCopyLink,
    },
    {
      label: "Share on Facebook",
      icon: <IconBrandFacebook size={18} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
    },
    {
      label: "Share on X",
      icon: <IconBrandX size={18} />,
      href: `https://x.com/intent/post?text=${shareText}&url=${encodedShareUrl}`,
    },
    {
      label: "Share on WhatsApp",
      icon: <IconBrandWhatsapp size={18} />,
      href: `https://wa.me/?text=${shareText}%20${encodedShareUrl}`,
    },
    {
      label: "Share by email",
      icon: <IconMail size={18} />,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${shareText}%20${encodedShareUrl}`,
    },
  ];

  return (
    <Stack gap="md">
      <Paper
        withBorder
        radius="lg"
        p={{ base: 18, sm: 24 }}
        style={{
          borderColor: "#e2e9e6",
          boxShadow: "0 8px 24px rgba(17, 24, 39, 0.06)",
        }}
      >
        <Stack gap="sm">
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
          <Button
            fullWidth
            size="md"
            variant="outline"
            leftSection={saved ? <IconCheck size={19} /> : <IconBookmark size={19} />}
            onClick={handleSave}
          >
            {saved ? "Quote saved" : "Save quote"}
          </Button>
        </Stack>
      </Paper>

      <Paper
        withBorder
        radius="lg"
        p={{ base: 18, sm: 24 }}
        style={{
          borderColor: "#e2e9e6",
          boxShadow: "0 8px 24px rgba(17, 24, 39, 0.06)",
        }}
      >
        <Text fw={700} c="#202939">
          Share this quote with a mate
        </Text>
        <Text mt={8} fz="sm" c="#687386" lh={1.5}>
          Help others know what a fair price looks like in your area.
        </Text>
        <Group mt="md" gap="sm">
          {socialLinks.map((social) =>
            social.href ? (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
                style={socialButtonStyle}
              >
                {social.icon}
              </a>
            ) : (
              <button
                key={social.label}
                type="button"
                onClick={social.onClick}
                aria-label={social.label}
                title={social.label}
                style={socialButtonStyle}
              >
                {social.icon}
              </button>
            ),
          )}
        </Group>
      </Paper>
    </Stack>
  );
};

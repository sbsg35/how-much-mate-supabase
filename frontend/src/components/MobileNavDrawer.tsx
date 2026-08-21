"use client";

import { Button, Divider, Drawer, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { FC } from "react";

import { NextLink } from "./NextLink";

export const MobileNavDrawer: FC<{
  opened: boolean;
  onClose: () => void;
  isLoading: boolean;
  isLoggedIn: boolean;
  pathname: string;
  logout: () => void | Promise<void>;
}> = ({ opened, onClose, isLoading, isLoggedIn, pathname, logout }) => {
  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title="Menu"
      size="xs"
      hiddenFrom="md"
    >
      <Stack gap="md">
        <NextLink href="/search" onClick={onClose} underline="never" fz="lg">
          Browse quotes
        </NextLink>

        {!isLoading && isLoggedIn ? (
          <>
            <NextLink
              href="/user/my-quotes"
              onClick={onClose}
              underline="never"
              fz="lg"
              fw={pathname.startsWith("/user/my-quotes") ? 500 : 400}
            >
              My quotes
            </NextLink>
            <NextLink
              href="/user/profile"
              onClick={onClose}
              underline="never"
              fz="lg"
              fw={pathname.startsWith("/user/profile") ? 500 : 400}
            >
              Profile
            </NextLink>

            <Divider />

            <Button
              component={Link}
              href="/quote/create"
              onClick={onClose}
              leftSection={<IconPlus size={18} />}
            >
              Add a quote
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : null}

        {!isLoading && !isLoggedIn ? (
          <>
            <NextLink
              href="/quote/create"
              onClick={onClose}
              underline="never"
              fz="lg"
            >
              Add a quote
            </NextLink>

            <Divider />

            <Button component={Link} href="/auth/login" onClick={onClose}>
              Sign in
            </Button>
            <Button
              component={Link}
              href="/auth/sign-up"
              onClick={onClose}
              variant="outline"
            >
              Register
            </Button>
          </>
        ) : null}
      </Stack>
    </Drawer>
  );
};

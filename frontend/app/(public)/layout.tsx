"use client";
import { AuthHeaderLinks } from "@/components/AuthHeaderLinks";
import { ColorSchemeToggle } from "@/components/ColorSchemeToggle";
import { DefaultContainer } from "@/components/DefaultContainer";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/icons/Logo";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { NextLink } from "@/components/NextLink";
import { UserLogoutAvatar } from "@/components/UserLogoutAvatar";
import { useAuth } from "@/providers/AuthProvider";
import { AppShell, Box, Burger, Button, Group, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode } from "react";

const PublicLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading, logout } = useAuth();
  const isLoggedIn = !!user;
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpened, { toggle: toggleMobileNav, close: closeMobileNav }] =
    useDisclosure(false);
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <AppShell header={{ height: 90 }} footer={{ height: 60 }}>
      <AppShell.Header>
        <DefaultContainer h="100%">
          <Group justify="space-between" h="100%">
            <NextLink href="/" underline="never">
              <Logo />
            </NextLink>

            <Group
              gap="xl"
              ml="auto"
              mr="xl"
              display={{ base: "none", md: "flex" }}
            >
              <NextLink href="/search" underline="never">
                Browse quotes
              </NextLink>
              {!isLoading && isLoggedIn ? (
                <>
                  <NextLink
                    href="/user/my-quotes"
                    underline="never"
                    fw={pathname.startsWith("/user/my-quotes") ? 500 : 400}
                    c={
                      pathname.startsWith("/user/my-quotes")
                        ? "var(--mantine-color-text)"
                        : undefined
                    }
                  >
                    My quotes
                  </NextLink>
                  <NextLink
                    href="/user/profile"
                    underline="never"
                    fw={pathname.startsWith("/user/profile") ? 500 : 400}
                    c={
                      pathname.startsWith("/user/profile")
                        ? "var(--mantine-color-text)"
                        : undefined
                    }
                  >
                    Profile
                  </NextLink>
                </>
              ) : null}
              {!isLoading && !isLoggedIn ? (
                <NextLink href="/quote/create" underline="never">
                  Add a quote
                </NextLink>
              ) : null}
            </Group>

            {isLoading ? (
              <Skeleton height={36} width={120} radius="md" />
            ) : isLoggedIn ? (
              <Group gap="sm">
                <ColorSchemeToggle />
                <Button
                  display={{ base: "none", md: "inline-flex" }}
                  component={Link}
                  href="/quote/create"
                  leftSection={<IconPlus size={18} />}
                  px="lg"
                >
                  Add a quote
                </Button>
                <Box display={{ base: "none", md: "inline-flex" }}>
                  <UserLogoutAvatar
                    email={user?.email}
                    name={
                      user?.user_metadata?.full_name ??
                      user?.user_metadata?.name
                    }
                    logout={handleLogout}
                  />
                </Box>
                <Burger
                  opened={mobileNavOpened}
                  onClick={toggleMobileNav}
                  hiddenFrom="md"
                  aria-label="Toggle navigation menu"
                />
              </Group>
            ) : (
              <Group gap="sm">
                <ColorSchemeToggle />
                <Box display={{ base: "none", md: "inline-flex" }}>
                  <AuthHeaderLinks />
                </Box>
                <Burger
                  opened={mobileNavOpened}
                  onClick={toggleMobileNav}
                  hiddenFrom="md"
                  aria-label="Toggle navigation menu"
                />
              </Group>
            )}
          </Group>
        </DefaultContainer>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
      <MobileNavDrawer
        opened={mobileNavOpened}
        onClose={closeMobileNav}
        isLoading={isLoading}
        isLoggedIn={isLoggedIn}
        pathname={pathname}
        logout={handleLogout}
      />
    </AppShell>
  );
};

export default PublicLayout;

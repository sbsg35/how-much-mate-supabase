"use client";
import { AuthHeaderLinks } from "@/components/AuthHeaderLinks";
import { DefaultContainer } from "@/components/DefaultContainer";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/icons/Logo";
import { NextLink } from "@/components/NextLink";
import { UserMenuDropdown } from "@/components/UserMenuDropdown";
import { useAuth } from "@/providers/AuthProvider";
import { AppShell, Button, Group, Skeleton } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FC, ReactNode } from "react";

const PublicLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading, logout } = useAuth();
  const isLoggedIn = !!user;
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <AppShell header={{ height: 65 }} footer={{ height: 60 }}>
      <AppShell.Header>
        <DefaultContainer h="100%">
          <Group justify="space-between" h="100%">
            <NextLink href="/">
              <Logo />
            </NextLink>

            {isLoading ? (
              <Skeleton height={36} width={120} radius="md" />
            ) : isLoggedIn ? (
              <Group>
                <Button
                  display={{ base: "none", md: "inline-flex" }}
                  component={NextLink}
                  href="/quote/create"
                  leftSection={<IconPlus />}
                >
                  Post quote
                </Button>
                <UserMenuDropdown
                  email={user?.email}
                  name={
                    user?.user_metadata?.full_name ?? user?.user_metadata?.name
                  }
                  logout={handleLogout}
                />
              </Group>
            ) : (
              <AuthHeaderLinks />
            )}
          </Group>
        </DefaultContainer>
      </AppShell.Header>
      <AppShell.Main>
        <DefaultContainer>{children}</DefaultContainer>
      </AppShell.Main>
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default PublicLayout;

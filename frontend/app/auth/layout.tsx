"use client";
import { DefaultContainer } from "@/components/DefaultContainer";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/icons/Logo";
import { NextLink } from "@/components/NextLink";
import { AppShell, Box, Container, Group, Paper } from "@mantine/core";
import { ReactNode, FC } from "react";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AppShell header={{ height: 65 }} footer={{ height: 60 }}>
      <AppShell.Header>
        <DefaultContainer h="100%">
          <Group justify="space-between" h="100%">
            <NextLink href="/">
              <Logo />
            </NextLink>
          </Group>
        </DefaultContainer>
      </AppShell.Header>

      <AppShell.Main>
        <DefaultContainer>
          <Box component="main">
            <Container size={460} my={30}>
              <Paper withBorder shadow="md" p={30} radius="md">
                {children}
              </Paper>
            </Container>
          </Box>
        </DefaultContainer>
      </AppShell.Main>
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default Layout;

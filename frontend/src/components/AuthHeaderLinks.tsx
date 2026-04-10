import { Button, Group } from "@mantine/core";

import { NextLink } from "./NextLink";

const authLinks = [
  {
    href: "/auth/login",
    label: "Sign in",
  },
  {
    href: "/auth/sign-up",
    label: "Register",
  },
];

export const AuthHeaderLinks = () => {
  return (
    <>
      <Group display={{ base: "none", md: "inherit" }}>
        {authLinks.map(({ href, label }) => (
          <NextLink
            key={href}
            href={href}
            display={{ base: "none", md: "initial" }}
          >
            <Button component="span" variant="outline">
              {label}
            </Button>
          </NextLink>
        ))}
      </Group>
      <Group display={{ base: "inherit", md: "none" }} gap="6">
        {authLinks.map(({ href, label }) => (
          <NextLink key={href} href={href}>
            <Button size="compact-sm" component="span" variant="outline">
              {label}
            </Button>
          </NextLink>
        ))}
      </Group>
    </>
  );
};

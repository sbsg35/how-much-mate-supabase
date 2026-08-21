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
    <Group>
      {authLinks.map(({ href, label }) => (
        <NextLink key={href} href={href}>
          <Button component="span" variant="outline">
            {label}
          </Button>
        </NextLink>
      ))}
    </Group>
  );
};

import Link from "next/link";

import { Anchor, Group } from "@mantine/core";

type AuthMode = "sign-in" | "sign-up";

interface AuthModeSwitcherProps {
  current: AuthMode;
}

const authModes = [
  { label: "Sign in", href: "/auth/login", value: "sign-in" },
  { label: "Create account", href: "/auth/sign-up", value: "sign-up" },
] as const;

export const AuthModeSwitcher = ({ current }: AuthModeSwitcherProps) => (
  <Group
    gap={0}
    grow
    mb="xl"
    aria-label="Authentication"
    role="navigation"
    style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
  >
    {authModes.map(({ label, href, value }) => {
      const isCurrent = current === value;

      return (
        <Anchor
          component={Link}
          href={href}
          key={value}
          aria-current={isCurrent ? "page" : undefined}
          c={isCurrent ? "var(--mantine-primary-color-filled)" : "dimmed"}
          fw={isCurrent ? 700 : 500}
          py="sm"
          ta="center"
          underline="never"
          style={{
            borderBottom: isCurrent
              ? "2px solid var(--mantine-primary-color-filled)"
              : "2px solid transparent",
            marginBottom: -1,
          }}
        >
          {label}
        </Anchor>
      );
    })}
  </Group>
);

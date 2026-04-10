import { Avatar, Group, Menu, UnstyledButton } from "@mantine/core";
import {
  IconLogout,
  IconPencilDollar,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { FC } from "react";

export const UserMenuDropdown: FC<{
  email: string | undefined;
  name: string | undefined;
  logout: () => void;
}> = ({ email, name, logout }) => {
  return (
    <Menu withArrow trigger="click" position="bottom-start">
      <Menu.Target>
        <UnstyledButton style={{}}>
          <Group>
            <Avatar
              color="var(--mantine-primary-color-filled)"
              radius="xl"
              size={40}
            >
              {name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase()}
            </Avatar>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          component={Link}
          href="/user/profile"
          leftSection={<IconSettings size={14} />}
        >
          Profile
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="/user/my-quotes"
          leftSection={<IconPencilDollar size={14} />}
        >
          My quotes
        </Menu.Item>
        <Menu.Item onClick={logout} leftSection={<IconLogout size={14} />}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
      {/* ... menu items */}
    </Menu>
  );
};

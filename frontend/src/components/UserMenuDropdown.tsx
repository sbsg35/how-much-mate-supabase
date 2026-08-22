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
  logout: () => void | Promise<void>;
}> = ({ email, name, logout }) => {
  return (
    <Menu withArrow trigger="click" position="bottom-start">
      <Menu.Target>
        <UnstyledButton style={{}}>
          <Group>
            <Avatar
              color="hmw.6"
              variant="filled"
              radius="xl"
              size={40}
            >
              {name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase()}
            </Avatar>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown miw={200}>
        <Menu.Item
          component={Link}
          href="/user/profile"
          leftSection={<IconSettings size={18} />}
          py={10}
          fz="md"
        >
          Profile
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="/user/my-quotes"
          leftSection={<IconPencilDollar size={18} />}
          py={10}
          fz="md"
        >
          My quotes
        </Menu.Item>
        <Menu.Item
          onClick={logout}
          leftSection={<IconLogout size={18} />}
          py={10}
          fz="md"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
      {/* ... menu items */}
    </Menu>
  );
};

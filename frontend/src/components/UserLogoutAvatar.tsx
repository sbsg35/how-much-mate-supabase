import { Avatar, Menu, UnstyledButton } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { FC } from "react";

export const UserLogoutAvatar: FC<{
  email: string | undefined;
  name: string | undefined;
  logout: () => void | Promise<void>;
}> = ({ email, name, logout }) => {
  return (
    <Menu withArrow trigger="click" position="bottom-end">
      <Menu.Target>
        <UnstyledButton aria-label="Account menu">
          <Avatar
            color="hmw.6"
            variant="filled"
            radius="xl"
            size={40}
          >
            {name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase()}
          </Avatar>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown miw={160}>
        <Menu.Item onClick={logout} leftSection={<IconLogout size={16} />}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

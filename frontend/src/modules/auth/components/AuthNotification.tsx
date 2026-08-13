"use client";

import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

const notificationMap = {
  password_reset: {
    color: "green",
    icon: <IconCheck />,
    message: "Success! Your password has been reset.",
  },
  auth_callback_error: {
    color: "red",
    icon: <IconAlertCircle />,
    message: "That link is invalid or has expired. Please request a new one.",
  },
};

type NotificationType = keyof typeof notificationMap;

export const AuthNotification: FC<{
  type: string | null;
  cleanupPath: string;
}> = ({ type, cleanupPath }) => {
  const router = useRouter();

  useEffect(() => {
    if (!type || !(type in notificationMap)) return;

    const { color, message, icon } =
      notificationMap[type as NotificationType];

    notifications.show({
      id: `auth-${type}`,
      color,
      icon,
      message,
      autoClose: 10_000,
      withCloseButton: true,
    });

    // Remove the trigger from the URL so refreshing does not show it again.
    router.replace(cleanupPath, { scroll: false });
  }, [cleanupPath, router, type]);

  return null;
};

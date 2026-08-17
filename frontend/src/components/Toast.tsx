import { notifications, NotificationData } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";

const POSITION = "bottom-center" as const;
const AUTO_CLOSE = 10_000;

type ToastOptions = Omit<NotificationData, "position" | "autoClose">;

function show(options: ToastOptions) {
  return notifications.show({
    ...options,
    position: POSITION,
    autoClose: AUTO_CLOSE,
  });
}

export const toast = {
  show,
  success: (options: ToastOptions) =>
    show({ color: "green", icon: <IconCheck size={18} />, ...options }),
  error: (options: ToastOptions) =>
    show({ color: "red", icon: <IconX size={18} />, ...options }),
  warning: (options: ToastOptions) =>
    show({ color: "yellow", icon: <IconAlertTriangle size={18} />, ...options }),
  info: (options: ToastOptions) =>
    show({ color: "blue", icon: <IconInfoCircle size={18} />, ...options }),
  update: notifications.update,
  hide: notifications.hide,
  clean: notifications.clean,
};

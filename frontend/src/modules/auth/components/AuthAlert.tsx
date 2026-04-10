import { Alert } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { FC, useState } from "react";

const alertMessageMap = {
  password_reset: {
    color: "green",
    icon: <IconCheck />,
    message: "Success! Your password has been reset.",
  },
};
type AlertType = keyof typeof alertMessageMap;

export const AuthAlert: FC<{
  type: string | null;
}> = ({ type }) => {
  const [showAlert, setShowAlert] = useState(true);
  if (!type || !(type in alertMessageMap)) {
    return null;
  }

  const { color, message, icon } = alertMessageMap[type as AlertType];

  return (
    <Alert
      color={color}
      display={showAlert ? "block" : "none"}
      withCloseButton
      onClose={() => setShowAlert(false)}
      mb={20}
      icon={icon}
    >
      {message}
    </Alert>
  );
};

import { Text, Title } from "@mantine/core";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

export const ResetPasswordPage = () => {
  return (
    <>
      <Title fz="h4" order={1}>
        Choose a new password
      </Title>
      <Text c="dimmed" fz="sm">
        Enter a new password for your How Much Mate account.
      </Text>
      <ResetPasswordForm />
    </>
  );
};

import { BodyText } from "@/components/BodyText";
import { Heading } from "@/components/Heading";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

export const ResetPasswordPage = () => {
  return (
    <>
      <Heading level={1} size="md">
        Choose a new password
      </Heading>
      <BodyText muted size="sm">
        Enter a new password for your How Much Mate account.
      </BodyText>
      <ResetPasswordForm />
    </>
  );
};

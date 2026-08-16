import { BackLink } from "@/components/BackLink";
import { BodyText } from "@/components/BodyText";
import { Heading } from "@/components/Heading";
import { Center } from "@mantine/core";
import { IconMailCheck } from "@tabler/icons-react";

export const PasswordResetRequestedPage = () => {
  return (
    <>
      <Heading level={1} size="md" ta="center">
        Check your email
      </Heading>
      <BodyText size="sm" ta="center">
        If an account exists for that address, we&apos;ve sent a link to reset
        its password. It may take a few seconds, and it&apos;s worth checking your
        spam folder too.
      </BodyText>
      <Center my="24">
        <IconMailCheck size={40} color="var(--mantine-color-anchor)" />
      </Center>
      <Center mt="4">
        <BackLink href="/auth/login">Back to sign in</BackLink>
      </Center>
    </>
  );
};

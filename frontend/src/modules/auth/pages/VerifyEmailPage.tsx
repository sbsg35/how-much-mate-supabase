import { BackLink } from "@/components/BackLink";
import { BodyText } from "@/components/BodyText";
import { Heading } from "@/components/Heading";
import { Center } from "@mantine/core";
import { IconMailCheck } from "@tabler/icons-react";

export const VerifyEmailPage = () => {
  return (
    <>
      <Heading level={1} size="md">
        Verify your email
      </Heading>
      <BodyText size="sm" ta="center">
        Check your inbox for a verification email. It might take a few seconds
        — and don&apos;t forget to peek in your spam just in case.
      </BodyText>
      <Center my="24">
        <IconMailCheck size={40} color="var(--mantine-color-anchor)" />
      </Center>
      <Center mt="4">
        <BackLink href="/">Back to the home page</BackLink>
      </Center>
    </>
  );
};

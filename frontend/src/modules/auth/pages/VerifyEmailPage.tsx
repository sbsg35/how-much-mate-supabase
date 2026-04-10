import { BackLink } from "@/components/BackLink";
import { Center, Text, Title } from "@mantine/core";
import { IconMailCheck } from "@tabler/icons-react";

export const VerifyEmailPage = () => {
  return (
    <>
      <Title size="lg">Verify your email</Title>
      <Text fz="sm" ta="center">
        Check your inbox for a verification email. It might take a few seconds
        — and don&apos;t forget to peek in your spam just in case.
      </Text>
      <Center my="24">
        <IconMailCheck size={40} color="var(--mantine-color-anchor)" />
      </Center>
      <Center mt="4">
        <BackLink href="/">Back to the home page</BackLink>
      </Center>
    </>
  );
};

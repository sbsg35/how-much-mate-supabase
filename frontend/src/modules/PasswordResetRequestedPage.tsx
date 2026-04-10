import { NextLink } from "@/components/NextLink";
import { Center, Flex, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconMailCheck } from "@tabler/icons-react";

export const PasswordResetRequestedPage = () => {
  return (
    <>
      <Title ta="center">Email sent</Title>

      <Text fz="sm" ta="center">
        Check your inbox for a link to reset your password. It might take a few
        seconds — and don&apos;t forget to peek in your spam just in case.
      </Text>
      <Center my="24">
        <IconMailCheck size={40} color="var(--mantine-color-anchor)" />
      </Center>
      <Center mt="4">
        <NextLink href="/">
          <Flex align="center">
            <IconArrowLeft size={18} stroke={1.5} />
            <Text>Back to the home page</Text>
          </Flex>
        </NextLink>
      </Center>
    </>
  );
};

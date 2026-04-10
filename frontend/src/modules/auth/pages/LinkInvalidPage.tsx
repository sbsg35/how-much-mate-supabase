import { NextLink } from "@/components/NextLink";
import { Title, Center, Flex, Text } from "@mantine/core";
import { IconMailCheck, IconArrowRight } from "@tabler/icons-react";

export const LinkInvalidPage = () => {
  return (
    <>
      <Title ta="center">Oops! That login link has expired.</Title>
      <Text fz="sm" ta="center">
        Magic links are valid for a limited time for your security. But don’t
        worry — you can get a new one in seconds.
      </Text>
      <Center my="24">
        <IconMailCheck size={40} color="var(--mantine-color-anchor)" />
      </Center>
      <Center mt="4">
        <NextLink href="/auth/login">
          <Flex align="center">
            <Text>Click here to request a fresh link</Text>
            <IconArrowRight size={18} stroke={1.5} />
          </Flex>
        </NextLink>
      </Center>
    </>
  );
};

"use client";
import { BodyText } from "@/components/BodyText";
import { Heading } from "@/components/Heading";
import { NextLink } from "@/components/NextLink";
import { Center, Flex, Button } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";

export const LoggedOutPage = () => {
  // get all from query params. ?all=x
  const params = useSearchParams();
  const all = params.get("all");

  return (
    <>
      <Heading level={1} size="md" ta="center">
        {all ? "Logged out of all devices" : "Logged out"}
      </Heading>

      {all ? (
        <BodyText size="sm" ta="center">
          We&apos;ve logged you out of all devices. Just a heads-up—it might
          take a couple of minutes to fully kick in.
        </BodyText>
      ) : (
        <BodyText size="sm" ta="center">
          You are now signed out!
        </BodyText>
      )}
      <Center my="24">
        <IconCircleCheck
          size={60}
          strokeWidth={2}
          color="var(--mantine-color-anchor)"
        />
      </Center>
      <Center mt="4">
        <NextLink href="/">
          <Flex align="center">
            <Button component="span">Back to home</Button>
          </Flex>
        </NextLink>
      </Center>
    </>
  );
};

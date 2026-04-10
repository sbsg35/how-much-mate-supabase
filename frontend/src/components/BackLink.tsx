import { Flex, FlexProps, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { NextLink } from "./NextLink";
import { FC } from "react";

export const BackLink: FC<
  { href: string; children: React.ReactNode } & FlexProps
> = ({ href, children, ...props }) => (
  <NextLink href={href}>
    <Flex align="center" {...props}>
      <IconArrowLeft size={18} stroke={1.5} />
      <Text>{children}</Text>
    </Flex>
  </NextLink>
);

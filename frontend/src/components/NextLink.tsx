"use client";

import { Anchor, AnchorProps } from "@mantine/core";
import Link, { LinkProps as NextLinkProps } from "next/link";
import React, { FC, ReactNode } from "react";

export const NextLink: FC<
  NextLinkProps & AnchorProps & { children: ReactNode }
> = ({ children, ...props }) => {
  return (
    <Anchor component={Link} {...props}>
      {children}
    </Anchor>
  );
};

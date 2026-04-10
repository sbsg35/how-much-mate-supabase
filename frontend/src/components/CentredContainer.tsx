import { Container, Paper } from "@mantine/core";
import React, { FC, ReactNode } from "react";

const sizes = {
  sm: 460,
  md: 720,
};

export const CentredContainer: FC<{
  children: ReactNode;
  size: "sm" | "md";
}> = ({ size = "sm", children }) => {
  const containerSize = sizes[size];
  return (
    <Container size={containerSize} my={30}>
      <Paper withBorder shadow="md" p={30} radius="md">
        {children}
      </Paper>
    </Container>
  );
};

import { Container, ContainerProps } from "@mantine/core";
import { FC, ReactNode } from "react";

export const DefaultContainer: FC<{ children: ReactNode } & ContainerProps> = ({
  children,
  ...rest
}) => (
  <Container size="xxl" {...rest}>
    {children}
  </Container>
);

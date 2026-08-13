"use client";

import { Container, Skeleton } from "@mantine/core";

export default function Loading() {
  return (
    <Container size={720} mt={90}>
      <Skeleton height="500px" width="100%" mb="md" radius="md" />
    </Container>
  );
}

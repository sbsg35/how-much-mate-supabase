"use client";
import { Grid, Skeleton } from "@mantine/core";
import { FC, ReactNode } from "react";

const Loading: FC<{ children: ReactNode }> = () => {
  return (
    <Grid columns={24} mt="xl">
      {/* Side bar */}
      <Grid.Col span={{ base: 24, md: 7 }} style={{ top: 0 }}>
        <Skeleton h={{ base: 100, md: 400 }} width="100%" radius="md" />
      </Grid.Col>

      {/* Quote list items */}

      <Grid.Col span={{ base: 24, md: 17 }}>
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} height={200} mb="md" radius="md" />
        ))}
      </Grid.Col>
    </Grid>
  );
};

export default Loading;

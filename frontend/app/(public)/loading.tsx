"use client";
import { DefaultContainer } from "@/components/DefaultContainer";
import { Grid, SimpleGrid, Skeleton } from "@mantine/core";

const Loading = () => {
  return (
    <DefaultContainer>
      <Grid columns={24} mt="xl">
        <Grid.Col span={{ base: 24, md: 7 }}>
          <Skeleton h={{ base: 100, md: 400 }} width="100%" radius="md" />
        </Grid.Col>

        <Grid.Col span={{ base: 24, md: 16 }} offset={{ base: 0, md: 1 }}>
          <SimpleGrid cols={{ base: 1, lg: 2 }}>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} height={270} radius="md" />
            ))}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </DefaultContainer>
  );
};

export default Loading;

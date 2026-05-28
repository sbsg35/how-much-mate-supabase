"use client";

import { Quote } from "@/service/quote";
import { Badge, Card, Divider, Flex, Group, Stack, Text } from "@mantine/core";
import { IconLocation, IconThumbUp } from "@tabler/icons-react";
import React from "react";
import styles from "./QuoteCard.module.css";
import { truncate } from "lodash";
import { PriceBadge } from "./PriceBadge";
import { NextLink } from "@/components/NextLink";

type QuoteCardProps = Pick<
  Quote,
  | "quote_id"
  | "title"
  | "price"
  | "like_count"
  | "dislike_count"
  | "description"
  | "completed"
  | "quote_date"
  | "username"
> & {
  categoryName?: string;
  suburbName?: string;
  suburbState?: string;
  description?: string;
};

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote_id,
  title,
  price,
  categoryName,
  suburbName,
  suburbState,
  description,
  completed,
  like_count,
}) => {
  return (
    <Card padding="lg" radius="md" withBorder className={styles.quoteCard}>
      <Stack gap={1} justify="space-between">
        <NextLink href={`/quote/${quote_id}`}>
          <Text fw={600} size="xl">
            {title}
          </Text>
        </NextLink>
        <Text c="gray.8">
          {truncate(description, { length: 120, omission: "..." })}
        </Text>
      </Stack>

      <PriceBadge completed={completed} price={price} />

      <Divider mb="sm" />

      <Group justify="start" mt={8}>
        <Badge color="gray.2" autoContrast fw={500}>
          {/* icons would be good here */}
          {categoryName}
        </Badge>

        {suburbName && (
          <Badge
            color="gray.2"
            autoContrast
            fw={500}
            leftSection={<IconLocation size="12" />}
          >
            {suburbState} - {suburbName}
          </Badge>
        )}
        <Group gap={0} align="center" ml="auto">
          {/* like count */}
          <Flex c="dimmed" component={Text} align="center">
            <IconThumbUp />
            <Text component="span">{like_count}</Text>
          </Flex>
        </Group>
      </Group>
    </Card>
  );
};

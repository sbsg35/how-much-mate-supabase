import { formatCurrency } from "@/lib/text";
import { Flex, Badge, Text } from "@mantine/core";
import { IconCheck, IconCurrencyDollar } from "@tabler/icons-react";
import { FC } from "react";

export const PriceBadge: FC<{ completed: boolean; price: string }> = ({
  completed,
  price,
}) => {
  return (
    <Flex align="end" justify="space-between">
      <Flex gap={4} align="center" mt="xs">
        <Text c={completed ? "green.9" : "orange.9"} fz="xl">
          {formatCurrency(price)}
        </Text>
        <Badge
          variant="light"
          color={completed ? "green" : "orange"}
          leftSection={
            completed ? (
              <IconCheck size="12" />
            ) : (
              <IconCurrencyDollar size="12" />
            )
          }
        >
          Job {completed ? "completed" : "quoted"}
        </Badge>
      </Flex>
    </Flex>
  );
};

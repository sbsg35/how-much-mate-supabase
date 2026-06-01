"use client";

import { useDeleteQuoteMutation } from "@/service/quote";
import { Button, Group, Modal, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

type QuoteDeleteButtonProps = {
  quoteId: string;
  quoteTitle: string;
};

export const QuoteDeleteButton = ({
  quoteId,
  quoteTitle,
}: QuoteDeleteButtonProps) => {
  const [opened, setOpened] = useState(false);
  const deleteQuoteMutation = useDeleteQuoteMutation();

  const handleDelete = async () => {
    try {
      await deleteQuoteMutation.mutateAsync(quoteId);
      notifications.show({
        title: "Quote deleted",
        message: `"${quoteTitle}" has been deleted`,
        color: "green",
      });
      setOpened(false);
    } catch (error) {
      notifications.show({
        title: "Delete failed",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
        color: "red",
      });
    }
  };

  return (
    <>
      <Button
        size="compact-sm"
        variant="outline"
        color="red"
        onClick={() => setOpened(true)}
        disabled={deleteQuoteMutation.isPending}
      >
        Delete
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete quote"
        centered
      >
        <Text>
          Are you sure you want to delete <strong>{quoteTitle}</strong>? This
          action cannot be undone.
        </Text>

        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={() => setOpened(false)}
            disabled={deleteQuoteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleteQuoteMutation.isPending}
          >
            Delete quote
          </Button>
        </Group>
      </Modal>
    </>
  );
};

"use client";

import { useDeleteQuoteMutation } from "@/service/quote";
import { Button, Group, Modal, Text } from "@mantine/core";
import { toast } from "@/components/Toast";
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
      toast.success({
        title: "Quote deleted",
        message: `"${quoteTitle}" has been deleted`,
      });
      setOpened(false);
    } catch (error) {
      toast.error({
        title: "Delete failed",
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
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

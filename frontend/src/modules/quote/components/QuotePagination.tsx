import { Button, Group } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface PaginationProps {
  previousPage: number | null;
  basePath: string;
  page: number;
  has_more: boolean;
}

export const QuotePagination: React.FC<PaginationProps> = ({
  has_more,
  previousPage,
  page,
  basePath,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Don't render pagination if there's no next or previous page
  if (!has_more && !previousPage) return null;

  const onNavigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <Group justify="center" mt={20}>
      {previousPage && (
        <Button
          onClick={() => previousPage && onNavigate(previousPage)}
          variant="default"
        >
          Previous
        </Button>
      )}
      <Button
        onClick={() => has_more && onNavigate(page + 1)}
        disabled={!has_more}
        variant="default"
      >
        Next
      </Button>
    </Group>
  );
};

"use client";
import { formatDateTime } from "@/lib/date";
import { useMyQuotes } from "@/service/quote";
import { QuoteDeleteButton } from "@/modules/quote/components/QuoteDeleteButton";
import React, { useMemo, useState } from "react";
import {
  Button,
  Table,
  Group,
  Text,
  Loader,
  Center,
  Paper,
  Title,
} from "@mantine/core";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { Quote } from "@/service/quote";
import Link from "next/link";

const columnHelper = createColumnHelper<Quote>();

export const QuoteUserListPage = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: quotes, isLoading } = useMyQuotes(
    pagination.pageIndex + 1,
    pagination.pageSize,
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Quote Title",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <Text tt="capitalize">{info.getValue()}</Text>,
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => {
          const price = info.getValue();
          return price != null ? `$${price}` : "-";
        },
      }),
      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: (info) => {
          const createdAt = info.getValue();
          return createdAt ? formatDateTime(createdAt) : "-";
        },
      }),
      columnHelper.accessor("updated_at", {
        header: "Updated At",
        cell: (info) => {
          const updatedAt = info.getValue();
          return updatedAt ? formatDateTime(updatedAt) : "-";
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const quote = info.row.original;
          return (
            <Group gap="xs">
              <Button
                size="compact-sm"
                variant="outline"
                component={Link}
                href={`/user/quote/${quote.quote_id}`}
              >
                Edit
              </Button>
              <QuoteDeleteButton
                quoteId={quote.quote_id}
                quoteTitle={quote.title}
              />
            </Group>
          );
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: quotes ?? [],
    columns,
    pageCount:
      quotes?.length === pagination.pageSize
        ? pagination.pageIndex + 2
        : pagination.pageIndex + 1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader />
      </Center>
    );
  }

  return (
    <Paper mt="xl" p="md" withBorder>
      <Title order={2} mb="md">
        My Quotes
      </Title>

      <Table>
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <Text ta="center" c="dimmed">
                  No quotes found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <Group justify="space-between" mt="md">
        <Text size="sm" c="dimmed">
          Page {pagination.pageIndex + 1}
        </Text>
        <Group gap="xs">
          <Button
            size="compact-sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            size="compact-sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </Group>
      </Group>
    </Paper>
  );
};

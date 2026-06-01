"use client";
import { Container, Title, Paper, Text, Loader, Center } from "@mantine/core";
import { useUserQuote } from "@/service/quote";
import { QuoteEditForm } from "../user/components/QuoteEditForm";

interface QuoteEditPageProps {
  quoteId: string;
}

export const QuoteEditPage = ({ quoteId }: QuoteEditPageProps) => {
  const { data: quote, isLoading, error } = useUserQuote(quoteId);

  if (isLoading) {
    return (
      <Container size="sm">
        <Center h={400}>
          <Loader size="lg" />
        </Center>
      </Container>
    );
  }

  if (error || !quote) {
    return (
      <Container size="sm">
        <Paper withBorder shadow="md" p={30} radius="md" mt="sm">
          <Title fz="h4" order={1} c="red">
            Error
          </Title>
          <Text c="dimmed">Failed to load quote. Please try again later.</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="sm">
      <Paper withBorder shadow="md" p={30} radius="md" mt="sm" pos="relative">
        <Title fz="h4" order={1}>
          Edit quote
        </Title>
        <Text c="dimmed">Update your quote details</Text>
        <QuoteEditForm quote={quote} />
      </Paper>
    </Container>
  );
};

"use client";
import { BodyText } from "@/components/BodyText";
import { Heading } from "@/components/Heading";
import { Container, Paper, Loader, Center } from "@mantine/core";
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
          <Heading level={1} size="md" c="red">
            Error
          </Heading>
          <BodyText muted>Failed to load quote. Please try again later.</BodyText>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="sm">
      <Paper withBorder shadow="md" p={30} radius="md" mt="sm" pos="relative">
        <Heading level={1} size="md">
          Edit quote
        </Heading>
        <BodyText muted>Update your quote details</BodyText>
        <QuoteEditForm quote={quote} />
      </Paper>
    </Container>
  );
};

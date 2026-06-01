import { Container, Title, Paper, Text } from "@mantine/core";
import { CreateQuoteDto } from "@/schema";
import type { CreateQuoteActionResult } from "./actions";
import { CreateQuoteForm } from "./components/CreateQuoteForm";

type QuoteCreatePageProps = {
  createQuoteAction: (
    data: CreateQuoteDto,
  ) => Promise<CreateQuoteActionResult | never>;
};

export const QuoteCreatePage = ({ createQuoteAction }: QuoteCreatePageProps) => {
  return (
    <Container size="sm">
      {/* for SEO */}

      <Paper withBorder shadow="md" p={30} radius="md" mt="sm" pos="relative">
        <Title fz="h4" order={1}>
          Create Quote
        </Title>
        <Text c="dimmed">Share quotes and help the community</Text>
        <CreateQuoteForm createQuoteAction={createQuoteAction} />
      </Paper>
    </Container>
  );
};

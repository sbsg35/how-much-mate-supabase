import {
  Box,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import type { Quote } from "@/service/admin-quote";
import { QuoteCard } from "@/modules/quote/components/QuoteCard";

export const RecentlySharedQuotes = ({
  quotes,
  renderedAt,
}: {
  quotes: Quote[];
  renderedAt: string;
}) => (
  <Box
    component="section"
    py={{ base: 46, md: 62 }}
    style={{
      background:
        "linear-gradient(115deg, #f8fcfa 0%, #f2faf7 55%, #f9fcfb 100%)",
    }}
  >
    <Container size="xxl">
      <Group justify="space-between" align="center" mb={{ base: 24, md: 30 }}>
        <Title order={2} fz={{ base: 26, sm: 30 }} c="#111827">
          Recently shared quotes
        </Title>
        <Box
          component={Link}
          href="/search"
          c="hmw.7"
          fz="sm"
          fw={600}
          style={{ textDecoration: "none" }}
        >
          <Group gap={7} wrap="nowrap">
            <Text component="span" inherit visibleFrom="xs">
              Browse all quotes
            </Text>
            <IconArrowRight size={17} stroke={1.8} />
          </Group>
        </Box>
      </Group>

      {quotes.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {quotes.map((quote) => (
            <QuoteCard
              key={quote.quote_id}
              quote={quote}
              renderedAt={renderedAt}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Text c="#5b6678">No quotes have been shared yet.</Text>
      )}
    </Container>
  </Box>
);

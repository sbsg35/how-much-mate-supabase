"use client";

import { DefaultContainer } from "@/components/DefaultContainer";

import {
  Box,
  Grid,
  SimpleGrid,
  Text,
  Title,
  VisuallyHidden,
} from "@mantine/core";
import { QuoteSearchForm } from "./components/QuoteSearchForm";
import { isNull, isUndefined, omitBy } from "lodash";
import { AUState, PublicQuotesSearchDto } from "@/schema";
import { QuoteCard } from "./components/QuoteCard";
import { QuotePagination } from "./components/QuotePagination";
import { Quote } from "@/service/quote";

type QuoteListPageProps = {
  quotes: Quote[];
  has_more: boolean;
} & PublicQuotesSearchDto;

export const QuoteListPage = ({
  quotes,
  page,
  keyword,
  search_type,
  state,
  limit,
  category_id,
  suburb_id,
  radius_km,
  has_more,
}: QuoteListPageProps) => {
  // This effect will run when the component mounts using the initial props
  // In a real app, you might want to fetch new data when page or keyword changes
  // For now, we're just using the server-side fetched data

  return (
    <DefaultContainer>
      <VisuallyHidden>
        <Title order={1}>Latest Quotes</Title>
      </VisuallyHidden>
      <Grid columns={24} mt="xl">
        <Grid.Col span={{ base: 24, md: 7 }}>
          <QuoteSearchForm
            defaultValues={
              omitBy(
                {
                  keyword,
                  search_type,
                  state: state as AUState,
                  page,
                  limit: limit,
                  category_id,
                  suburb_id,
                  radius_km,
                },
                (value) => isNull(value) || isUndefined(value),
              ) as unknown as PublicQuotesSearchDto
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 24, md: 16 }} offset={{ base: 0, md: 1 }}>
          {quotes.length === 0 ? (
            <Box ta="center" my={12}>
              <Title order={2}>No quotes found</Title>
              <Text size="sm" c="dimmed">
                {keyword
                  ? "Try a different search term or browse all quotes"
                  : "Check back soon for new quotes"}
              </Text>
            </Box>
          ) : (
            <SimpleGrid cols={{ base: 1 }}>
              {quotes.map((quote: Quote) => (
                <QuoteCard
                  key={quote.quote_id}
                  quote_id={quote.quote_id}
                  title={quote.title}
                  price={quote.price}
                  description={quote.description}
                  like_count={quote.like_count}
                  dislike_count={quote.dislike_count}
                  categoryName={quote.category?.name}
                  suburbName={quote.suburb?.locality}
                  suburbState={quote.suburb?.state}
                  completed={quote.completed}
                  quote_date={quote.quote_date}
                />
              ))}
            </SimpleGrid>
          )}

          <QuotePagination
            page={page}
            previousPage={page - 1}
            has_more={has_more}
            basePath="/"
          />
        </Grid.Col>
      </Grid>
    </DefaultContainer>
  );
};

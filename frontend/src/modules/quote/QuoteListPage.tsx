"use client";

import { DefaultContainer } from "@/components/DefaultContainer";
import { BodyText } from "@/components/BodyText";
import { Heading } from "@/components/Heading";

import {
  Box,
  Grid,
  SimpleGrid,
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
  renderedAt: string;
} & PublicQuotesSearchDto;

export const QuoteListPage = ({
  quotes,
  page,
  keyword,
  sort_by,
  search_type,
  state,
  limit,
  category_id,
  suburb_id,
  radius_km,
  has_more,
  renderedAt,
}: QuoteListPageProps) => {
  // This effect will run when the component mounts using the initial props
  // In a real app, you might want to fetch new data when page or keyword changes
  // For now, we're just using the server-side fetched data

  return (
    <DefaultContainer>
      <VisuallyHidden>
        <Heading level={1}>Latest Quotes</Heading>
      </VisuallyHidden>
      <Grid columns={24} mt="xl">
        <Grid.Col span={{ base: 24, md: 7 }}>
          <QuoteSearchForm
            defaultValues={
              omitBy(
                {
                  keyword,
                  sort_by,
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
              <Heading>No quotes found</Heading>
              <BodyText size="sm" muted>
                {keyword
                  ? "Try a different search term or browse all quotes"
                  : "Check back soon for new quotes"}
              </BodyText>
            </Box>
          ) : (
            <SimpleGrid cols={{ base: 1, lg: 2 }}>
              {quotes.map((quote: Quote) => (
                <QuoteCard
                  key={quote.quote_id}
                  quote={quote}
                  renderedAt={renderedAt}
                />
              ))}
            </SimpleGrid>
          )}

          <QuotePagination
            page={page}
            previousPage={page - 1}
            has_more={has_more}
            basePath="/search"
          />
        </Grid.Col>
      </Grid>
    </DefaultContainer>
  );
};

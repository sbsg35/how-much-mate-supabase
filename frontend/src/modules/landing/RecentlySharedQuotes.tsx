import {
  Badge,
  Box,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
import type { Quote } from "@/service/admin-quote";

const cardStyle: CSSProperties = {
  display: "block",
  minHeight: 270,
  padding: 22,
  color: "#111827",
  textDecoration: "none",
  border: "1px solid #e1e8e5",
  borderRadius: 12,
  background: "rgba(255, 255, 255, 0.94)",
  boxShadow: "0 6px 18px rgba(17, 24, 39, 0.07)",
  transition:
    "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
};

const setCardHover = (
  event: MouseEvent<HTMLAnchorElement>,
  hovered: boolean,
) => {
  const card = event.currentTarget;
  card.style.borderColor = hovered
    ? "var(--mantine-color-hmw-3)"
    : "#e1e8e5";
  card.style.boxShadow = hovered
    ? "0 12px 28px rgba(19, 105, 66, 0.12)"
    : "0 6px 18px rgba(17, 24, 39, 0.07)";
  card.style.transform = hovered ? "translateY(-3px)" : "none";
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

const formatQuoteAge = (createdAt: string, renderedAt: string) => {
  const elapsed = Math.max(
    0,
    new Date(renderedAt).getTime() - new Date(createdAt).getTime(),
  );
  const days = Math.floor(elapsed / 86_400_000);

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(days / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
};

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
            <Link
              key={quote.quote_id}
              href={`/quote/${quote.quote_id}`}
              style={cardStyle}
              onMouseEnter={(event) => setCardHover(event, true)}
              onMouseLeave={(event) => setCardHover(event, false)}
            >
              <Stack h="100%" gap={0}>
                <Group justify="space-between" align="center" wrap="nowrap">
                  <Badge color="hmw" variant="light" radius="xl" tt="none">
                    {quote.category?.name ?? "Service"}
                  </Badge>
                  {quote.category?.slug && (
                    <ThemeIcon color="hmw" variant="light" radius="xl" size={34}>
                      <svg
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <use
                          href={`/icons/categories/sprite.svg#icon-${quote.category.slug}`}
                        />
                      </svg>
                    </ThemeIcon>
                  )}
                </Group>

                <Text
                  mt={14}
                  fw={700}
                  fz="md"
                  lh={1.3}
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                  }}
                >
                  {quote.title}
                </Text>
                <Text mt={6} fz="sm" c="#697386">
                  {[quote.suburb?.locality, quote.suburb?.state]
                    .filter(Boolean)
                    .join(", ")}
                </Text>

                <Text mt={16} c="hmw.6" fz={24} fw={800} lh={1.2}>
                  {formatPrice(quote.price)}
                </Text>
                <Text
                  mt={12}
                  fz="sm"
                  c="#5b6678"
                  lh={1.45}
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                  }}
                >
                  {quote.description}
                </Text>

                <Text mt="auto" pt={18} fz="xs" c="#697386">
                  {formatQuoteAge(quote.created_at, renderedAt)}
                </Text>
              </Stack>
            </Link>
          ))}
        </SimpleGrid>
      ) : (
        <Text c="#5b6678">No quotes have been shared yet.</Text>
      )}
    </Container>
  </Box>
);

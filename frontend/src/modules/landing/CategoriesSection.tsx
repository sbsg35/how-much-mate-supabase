import { Box, Container, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import type { CSSProperties, MouseEvent } from "react";
import Link from "next/link";
import type { Category } from "@/service/category.server";

const cardStyle: CSSProperties = {
  display: "block",
  minHeight: 112,
  padding: "16px 10px 14px",
  color: "var(--hmw-heading)",
  textDecoration: "none",
  border: "1px solid var(--hmw-border)",
  borderRadius: 10,
  background: "var(--hmw-surface)",
  boxShadow: "0 4px 12px rgba(17, 24, 39, 0.05)",
  transition:
    "color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
};

const iconStyle: CSSProperties = {
  width: 34,
  height: 34,
  flex: "0 0 auto",
  color: "var(--mantine-color-hmw-6)",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const setCardHover = (
  event: MouseEvent<HTMLAnchorElement>,
  hovered: boolean,
) => {
  const card = event.currentTarget;
  card.style.color = hovered
    ? "var(--mantine-color-hmw-7)"
    : "var(--hmw-heading)";
  card.style.borderColor = hovered
    ? "var(--mantine-color-hmw-3)"
    : "var(--hmw-border)";
  card.style.boxShadow = hovered
    ? "0 9px 22px rgba(19, 105, 66, 0.11)"
    : "0 4px 12px rgba(17, 24, 39, 0.05)";
  card.style.transform = hovered ? "translateY(-2px)" : "none";
};

export const CategoriesSection = ({
  categories,
}: {
  categories: Category[];
}) => {
  return (
    <Box
      component="section"
      py={{ base: 42, md: 54 }}
      bg="var(--hmw-surface)"
      style={{
        borderTop: "1px solid var(--hmw-border)",
        borderBottom: "1px solid var(--hmw-border)",
      }}
    >
      <Container size="xxl">
        <Stack gap={8} align="center" mb={{ base: 28, md: 34 }}>
          <Title order={2} fz={{ base: 26, sm: 30 }} c="var(--hmw-heading)">
            Browse categories
          </Title>
          <Text c="var(--hmw-muted-text)" ta="center">
            Find real prices for the service you need.
          </Text>
        </Stack>

        <SimpleGrid
          cols={{ base: 2, xs: 3, md: 6 }}
          spacing={{ base: 12, sm: 16 }}
        >
          {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/search?category_id=${category.category_id}`}
                style={cardStyle}
                onMouseEnter={(event) => setCardHover(event, true)}
                onMouseLeave={(event) => setCardHover(event, false)}
              >
                <Stack h="100%" align="center" justify="center" gap={12}>
                  <svg style={iconStyle} aria-hidden="true">
                    <use
                      href={`/icons/categories/sprite.svg#icon-${category.slug}`}
                    />
                  </svg>
                  <Text
                    component="span"
                    fz="sm"
                    fw={600}
                    ta="center"
                    lh={1.25}
                    style={{ textWrap: "balance" }}
                  >
                    {category.name}
                  </Text>
                </Stack>
              </Link>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

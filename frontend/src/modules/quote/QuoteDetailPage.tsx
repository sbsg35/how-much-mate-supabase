import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Grid,
  GridCol,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconBriefcase,
  IconBuildingStore,
  IconCalendar,
  IconMapPin,
  IconTag,
  IconUser,
} from "@tabler/icons-react";
import { NextLink } from "@/components/NextLink";
import { ShareButtons } from "@/components/ShareButtons";
import { BodyText } from "@/components/BodyText";
import { Heading } from "@/components/Heading";
import type { Quote } from "@/service/admin-quote";

interface QuoteDetailPageProps {
  quote: Quote;
  shareUrl: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

const GST_STATUS_LABEL: Record<string, string> = {
  included: "GST included",
  excluded: "GST excluded",
  unknown: "GST unknown",
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Group gap={16} wrap="nowrap" align="flex-start">
    <ThemeIcon variant="transparent" color="hmw" size={24} mt={2}>
      {icon}
    </ThemeIcon>
    <Box style={{ minWidth: 0 }}>
      <BodyText size="sm" fw={700} c="#253044">
        {label}
      </BodyText>
      <BodyText mt={4} c="#394559" lh={1.4}>
        {value}
      </BodyText>
    </Box>
  </Group>
);

export const QuoteDetailPage = ({ quote, shareUrl }: QuoteDetailPageProps) => {
  const submitterName = quote.username?.trim() || "Community member";
  const location = quote.suburb
    ? `${quote.suburb.locality}, ${quote.suburb.postcode}, ${quote.suburb.state}`
    : "Not provided";

  return (
    <Box
      py={{ base: 24, md: 38 }}
      mih="calc(100vh - var(--app-shell-header-height))"
      style={{
        background:
          "linear-gradient(135deg, #f7fbfa 0%, #ffffff 46%, #f4faf7 100%)",
      }}
    >
      <Container size="xl">
        <Breadcrumbs
          mb={22}
          separator="›"
          separatorMargin="sm"
          styles={{ separator: { color: "#9aa5b5" } }}
        >
          <NextLink href="/" c="hmw.7" fz="sm" underline="never">
            Home
          </NextLink>
          <NextLink href="/search" c="hmw.7" fz="sm" underline="never">
            Quotes
          </NextLink>
          <BodyText size="sm" muted lineClamp={1}>
            {quote.title}
          </BodyText>
        </Breadcrumbs>

        <Paper
          withBorder
          radius="lg"
          p={{ base: 24, sm: 38, lg: 54 }}
          style={{
            borderColor: "#d8e0e5",
            boxShadow: "0 16px 42px rgba(17, 24, 39, 0.08)",
          }}
        >
          <Heading
            level={1}
            fw={800}
            c="#111827"
            style={{ letterSpacing: "-0.035em" }}
          >
            {quote.title}
          </Heading>
          {quote.description ? (
            <BodyText
              mt={12}
              c="#394559"
              maw={900}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {quote.description}
            </BodyText>
          ) : null}

          <Divider my={{ base: 28, sm: 36 }} color="#d8e0e5" />

          <Grid columns={12} gap={{ base: 36, md: 56 }} align="flex-start">
            <GridCol span={{ base: 12, md: 7 }}>
              <Stack gap={30}>
                <DetailItem
                  icon={<IconBuildingStore size={23} stroke={1.8} />}
                  label="Service provider"
                  value={quote.business_name}
                />
                <DetailItem
                  icon={<IconTag size={23} stroke={1.8} />}
                  label="Category"
                  value={quote.category?.name ?? "Service"}
                />
                <DetailItem
                  icon={<IconMapPin size={23} stroke={1.8} />}
                  label="Location"
                  value={location}
                />
                <DetailItem
                  icon={<IconCalendar size={23} stroke={1.8} />}
                  label="Quote year"
                  value={String(quote.quote_year)}
                />
                <DetailItem
                  icon={<IconBriefcase size={23} stroke={1.8} />}
                  label="Status"
                  value={quote.completed ? "Completed" : "Quoted"}
                />

                <DetailItem
                  icon={<IconUser size={23} stroke={1.8} />}
                  label="Submitted by"
                  value={submitterName}
                />
              </Stack>
            </GridCol>

            <GridCol span={{ base: 12, md: 5 }}>
              <Stack gap={22}>
                <Box
                  p={{ base: 24, sm: 28 }}
                  style={{
                    border: "1px solid #bfe8d5",
                    borderRadius: "var(--mantine-radius-lg)",
                    background:
                      "linear-gradient(145deg, #f2fbf7 0%, #e8f8f1 100%)",
                  }}
                >
                  <BodyText size="sm" c="#4f5b6f" fw={700}>
                    What was quoted
                  </BodyText>
                  <Text
                    mt={10}
                    c="hmw.6"
                    fz={{ base: 42, sm: 50 }}
                    fw={800}
                    lh={1}
                    style={{
                      letterSpacing: "-0.04em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatPrice(quote.price)}
                  </Text>
                  <BodyText mt={4} size="xs" c="#697386">
                    {GST_STATUS_LABEL[quote.gst_status] ?? "GST unknown"}
                  </BodyText>
                  <BodyText mt={10} size="xs" c="#697386">
                    One quote, for reference — prices vary with scope,
                    materials, access and timing.
                  </BodyText>
                </Box>

                <Divider color="#e2e9e6" />
                <ShareButtons title={quote.title} shareUrl={shareUrl} />
              </Stack>
            </GridCol>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

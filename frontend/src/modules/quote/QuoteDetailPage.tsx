import {
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Container,
  Grid,
  GridCol,
  Group,
  Paper,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBriefcase,
  IconBuildingStore,
  IconCalendar,
  IconCircleCheck,
  IconMapPin,
  IconTag,
} from "@tabler/icons-react";
import { NextLink } from "@/components/NextLink";
import { ShareButtons } from "@/components/ShareButtons";
import type { Quote } from "@/service/admin-quote";
import { formatDate, timeAgo } from "@/lib/date";

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

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Group gap={10} wrap="nowrap" align="flex-start">
    <ThemeIcon variant="transparent" color="hmw" size={20} mt={1}>
      {icon}
    </ThemeIcon>
    <Box>
      <Text fz="xs" c="#687386">
        {label}
      </Text>
      <Text mt={5} fz="sm" fw={700} c="#253044">
        {value}
      </Text>
    </Box>
  </Group>
);

export const QuoteDetailPage = ({ quote, shareUrl }: QuoteDetailPageProps) => {
  const submittedAgo = quote.created_at ? timeAgo(quote.created_at) : "Recently";
  const submitterName = quote.username?.trim() || "Community member";
  const submitterInitial = submitterName.charAt(0).toUpperCase();
  const location = quote.suburb
    ? `${quote.suburb.locality}, ${quote.suburb.state} ${quote.suburb.postcode}`
    : "Location not provided";

  return (
    <Box
      py={{ base: 24, md: 38 }}
      mih="calc(100vh - var(--app-shell-header-height))"
      style={{
        background:
          "linear-gradient(135deg, #f7fbfa 0%, #ffffff 46%, #f4faf7 100%)",
      }}
    >
      <Container size="xxl">
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
          <Text fz="sm" c="#687386" lineClamp={1}>
            {quote.title}
          </Text>
        </Breadcrumbs>

        <Grid columns={24} gap={{ base: 20, lg: 26 }} align="flex-start">
          <GridCol span={{ base: 24, lg: 17 }}>
            <Paper
              withBorder
              radius="lg"
              p={{ base: 22, sm: 30 }}
              style={{
                borderColor: "#e2e9e6",
                boxShadow: "0 8px 28px rgba(17, 24, 39, 0.07)",
              }}
            >
              <Grid gap={{ base: 26, md: 34 }}>
                <GridCol span={{ base: 12, md: 8 }}>
                  <Group gap={10} mb={16}>
                    <Badge color="hmw" variant="light" radius="xl" tt="none">
                      {quote.completed ? "Completed" : "Quoted"}
                    </Badge>
                    <Text fz="sm" c="#687386">
                      • Submitted {submittedAgo}
                    </Text>
                  </Group>

                  <Title
                    order={1}
                    fz={{ base: 36, sm: 48 }}
                    lh={1.1}
                    fw={800}
                    c="#111827"
                    style={{ letterSpacing: "-0.035em" }}
                  >
                    {quote.title}
                  </Title>

                  <Group mt={14} gap={8} wrap="nowrap" c="#566277">
                    <IconMapPin size={19} stroke={1.8} />
                    <Text fz={{ base: "sm", sm: "md" }} fw={600}>
                      {location}
                    </Text>
                  </Group>

                  <Text mt={24} c="#536075" lh={1.65} maw={650}>
                    {quote.description}
                  </Text>

                  <SimpleGrid
                    cols={{ base: 2, sm: 3, md: 5 }}
                    spacing={{ base: 20, sm: 24 }}
                    mt={30}
                  >
                    <DetailItem
                      icon={<IconTag size={18} stroke={1.8} />}
                      label="Category"
                      value={quote.category?.name ?? "Service"}
                    />
                    <DetailItem
                      icon={<IconBuildingStore size={18} stroke={1.8} />}
                      label="Provider"
                      value={quote.business_name}
                    />
                    <DetailItem
                      icon={<IconMapPin size={18} stroke={1.8} />}
                      label="Suburb"
                      value={quote.suburb?.locality ?? "Not provided"}
                    />
                    <DetailItem
                      icon={<IconMapPin size={18} stroke={1.8} />}
                      label="State"
                      value={quote.suburb?.state ?? "—"}
                    />
                    <DetailItem
                      icon={<IconBriefcase size={18} stroke={1.8} />}
                      label="Job status"
                      value={quote.completed ? "Completed" : "Quoted"}
                    />
                  </SimpleGrid>

                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mt={30}>
                    <Paper
                      withBorder
                      radius="md"
                      p="md"
                      style={{ borderColor: "#e2e9e6" }}
                    >
                      <Group gap="sm" wrap="nowrap">
                        <Avatar color="blue" radius="xl" size={38}>
                          {submitterInitial}
                        </Avatar>
                        <Box>
                          <Text fz="xs" c="#687386">
                            Submitted by
                          </Text>
                          <Text fz="sm" fw={700} c="#253044">
                            {submitterName}
                          </Text>
                          <Text fz="xs" c="#687386">
                            Community member
                          </Text>
                        </Box>
                      </Group>
                    </Paper>

                    <Paper
                      withBorder
                      radius="md"
                      p="md"
                      style={{ borderColor: "#e2e9e6" }}
                    >
                      <Group gap="sm" wrap="nowrap">
                        <ThemeIcon variant="light" color="gray" size={38}>
                          <IconCalendar size={20} stroke={1.7} />
                        </ThemeIcon>
                        <Box>
                          <Text fz="xs" c="#687386">
                            Quote date
                          </Text>
                          <Text fz="sm" fw={700} c="#253044">
                            {formatDate(`${quote.quote_date}T00:00:00`)}
                          </Text>
                        </Box>
                      </Group>
                    </Paper>
                  </SimpleGrid>
                </GridCol>

                <GridCol span={{ base: 12, md: 4 }}>
                  <Paper
                    withBorder
                    radius="lg"
                    p={{ base: 20, sm: 22 }}
                    h="100%"
                    mih={240}
                    style={{
                      borderColor: "#bfe8d5",
                      background:
                        "linear-gradient(145deg, #f1fbf7 0%, #eaf8f2 100%)",
                    }}
                  >
                    <Text fz="sm" c="#5b6678" fw={600}>
                      Quoted price
                    </Text>
                    <Text
                      mt={8}
                      c="hmw.6"
                      fz={{ base: 38, sm: 42, md: 34, lg: 38 }}
                      fw={800}
                      lh={1}
                      style={{
                        letterSpacing: "-0.035em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatPrice(quote.price)}
                    </Text>
                    <Text mt={18} fz="sm" c="#536075" fw={600}>
                      Total submitted price
                    </Text>
                    <Group mt={20} gap={8} wrap="nowrap" c="hmw.7">
                      <IconCircleCheck size={18} stroke={1.8} />
                      <Text fz="sm" fw={600}>
                        Community-submitted price
                      </Text>
                    </Group>
                  </Paper>
                </GridCol>
              </Grid>
            </Paper>
          </GridCol>

          <GridCol span={{ base: 24, lg: 7 }}>
            <ShareButtons title={quote.title} shareUrl={shareUrl} />
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
};

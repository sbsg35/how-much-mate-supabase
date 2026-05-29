import { Divider, Group, Stack, Text, Title } from "@mantine/core";
import {
  IconCalendar,
  IconCategory,
  IconCoin,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";
import { CentredContainer } from "@/components/CentredContainer";
import { BackLink } from "@/components/BackLink";
import { ShareButtons } from "@/components/ShareButtons";
import { Quote } from "@/service/admin-quote";
import { timeAgo } from "@/lib/date";

interface QuoteDetailPageProps {
  quote: Quote;
  shareUrl: string;
}

export const QuoteDetailPage = ({ quote, shareUrl }: QuoteDetailPageProps) => {
  const formattedDate = quote.created_at
    ? timeAgo(quote.created_at)
    : "Recently";

  return (
    <>
      <BackLink href="/" mt="md">
        Back
      </BackLink>
      <CentredContainer size="md">
        <Title order={1}>{quote.title}</Title>
        <Text>{quote.description}</Text>

        <Divider my="md" />
        <Stack>
          <Group>
            <IconUser size={20} />
            <div>
              <Text fw={500}>Service Provider</Text>
              <Text>{quote.business_name}</Text>
            </div>
          </Group>

          {quote.category && (
            <Group>
              <IconCategory size={20} />
              <div>
                <Text fw={500}>Category</Text>
                <Text>{quote.category.name}</Text>
              </div>
            </Group>
          )}

          {quote.suburb && (
            <Group>
              <IconMapPin size={20} />
              <div>
                <Text fw={500}>Location</Text>
                <Text>
                  {quote.suburb.locality}, {quote.suburb.state}{" "}
                  {quote.suburb.postcode}
                </Text>
              </div>
            </Group>
          )}

          {quote.created_at && (
            <Group>
              <IconCalendar size={20} />
              <div>
                <Text fw={500}>Published At</Text>
                <Text>{formattedDate}</Text>
              </div>
            </Group>
          )}

          {quote.price !== null && (
            <Group>
              <IconCoin size={20} />
              <div>
                <Text fw={500}>Price</Text>
                <Text>${quote.price}</Text>
              </div>
            </Group>
          )}

          {quote.completed !== undefined && (
            <Group>
              <IconCalendar size={20} />
              <div>
                <Text fw={500}>Status</Text>
                <Text>{quote.completed ? "Completed" : "Not Completed"}</Text>
              </div>
            </Group>
          )}
        </Stack>

        <ShareButtons title={quote.title} shareUrl={shareUrl} />
      </CentredContainer>
    </>
  );
};

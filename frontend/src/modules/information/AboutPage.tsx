import { Container, List, ListItem, Stack, Text, Title } from "@mantine/core";
import { NextLink } from "@/components/NextLink";

export const AboutPage = () => {
  return (
    <Container component="article" size="md" py={{ base: "xl", md: 48 }}>
      <Stack gap="xl">
        <Stack gap="md">
          <Title order={1}>About How Much Mate</Title>
          <Text size="lg">
            Getting a quote shouldn&apos;t leave you wondering whether you&apos;re
            paying a fair price.
          </Text>
          <Text>
            For many everyday services, that&apos;s exactly what happens. You
            contact a few providers, wait for replies, and receive a price with
            very little context for how it compares with similar jobs nearby.
          </Text>
          <Text fw={600}>How Much Mate makes that easier.</Text>
          <Text>
            We&apos;re building a community-powered database of quotes and prices
            people have received for everyday services across Australia. It
            helps you see what similar work has cost other people in your area.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Title order={2}>Real-world prices. Local context.</Title>
          <Text>
            There&apos;s rarely one correct price for a job. Costs can vary with
            the size and complexity of the work, location, materials, timing,
            and the provider.
          </Text>
          <Text>
            Rather than telling you exactly what a job should cost, How Much
            Mate shares real-world pricing submitted by the community. Use it
            as a reference point when you&apos;re:
          </Text>
          <List spacing="xs">
            <ListItem>comparing quotes</ListItem>
            <ListItem>budgeting for an upcoming job</ListItem>
            <ListItem>deciding whether a price looks reasonable</ListItem>
            <ListItem>
              working out what to ask before accepting a quote
            </ListItem>
          </List>
        </Stack>

        <Stack gap="sm">
          <Title order={2}>Powered by the community</Title>
          <Text>
            How Much Mate gets more useful every time someone shares a quote.
            Contributing the price, location, type of work, and a few job
            details can help the next person make a more informed decision.
          </Text>
          <Text>
            Submissions are checked before publication to identify unusual
            prices, inconsistent information, and potentially unreliable
            entries. Because the information comes from the community, we
            can&apos;t independently verify every quote, price, or job.
          </Text>
          <Text fw={600}>
            Use How Much Mate as a reference point, not a guarantee of what a
            particular job should cost.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Title order={2}>Why we built How Much Mate</Title>
          <Text>
            Product prices are easy to find online. Service prices are
            different: it can be surprisingly difficult to discover what
            someone else paid for an everyday job without requesting quotes
            yourself.
          </Text>
          <Text>
            How Much Mate exists to make local service pricing more
            transparent, one community-submitted quote at a time.
          </Text>
          <Text size="lg" fw={600}>
            So next time a quote lands in your inbox and you think, “How much,
            mate?”, you&apos;ll have somewhere to check.
          </Text>
          <NextLink href="/quote/create" fw={600}>
            Share a quote
          </NextLink>
        </Stack>
      </Stack>
    </Container>
  );
};

import { Container, List, ListItem, Stack, Text, Title } from "@mantine/core";

export const PrivacyPage = () => {
  return (
    <Container component="article" size="md" py={{ base: "xl", md: 48 }}>
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={1}>Privacy Policy</Title>
          <Text c="dimmed">Last updated: 14 August 2026</Text>
          <Text mt="sm">
            How Much Mate respects your privacy and is committed to handling
            personal information responsibly and transparently. This policy
            explains what we collect, how we use and protect it, and the
            choices you have when using the service.
          </Text>
        </Stack>

        <PolicySection title="1. Information we collect">
          <Text>If you create an account, we collect:</Text>
          <List spacing="xs">
            <ListItem>your email address and username, if provided</ListItem>
            <ListItem>authentication and account identifiers</ListItem>
            <ListItem>information associated with signing in</ListItem>
          </List>
          <Text>
            When you submit a quote, we collect the job title and description,
            business name, price, service category, suburb, quote date, and
            whether you went ahead with the work.
          </Text>
          <Text>
            Our service providers may also process technical information needed
            to operate and secure the site, such as your IP address, browser
            information, authentication cookies, timestamps, and security
            signals.
          </Text>
        </PolicySection>

        <PolicySection title="2. How we use information">
          <Text>We use this information to:</Text>
          <List spacing="xs">
            <ListItem>create, authenticate, and manage accounts</ListItem>
            <ListItem>operate and secure How Much Mate</ListItem>
            <ListItem>
              publish community-submitted quote and pricing information
            </ListItem>
            <ListItem>
              review submissions for inaccurate, inappropriate, or unreliable
              content
            </ListItem>
            <ListItem>prevent spam, fraud, and misuse</ListItem>
            <ListItem>maintain and improve the service</ListItem>
            <ListItem>comply with legal obligations</ListItem>
          </List>
          <Text>
            How Much Mate is not intended to be a directory of identifiable
            customers or homeowners. Published information is intended to give
            useful context about service pricing.
          </Text>
        </PolicySection>

        <PolicySection title="3. Quote moderation and automated checks">
          <Text>
            Quote titles, business names, descriptions, prices, and categories
            may be checked automatically before publication. We use OpenAI
            services to help identify inappropriate content and submissions
            that may require review.
          </Text>
          <Text>
            A submission may be published, delayed, rejected, or held for
            manual review. These checks improve data quality but do not
            guarantee that every published quote is genuine, accurate, or
            independently verified.
          </Text>
        </PolicySection>

        <PolicySection title="4. Information shown publicly">
          <Text>A published quote may show:</Text>
          <List spacing="xs">
            <ListItem>job title and description</ListItem>
            <ListItem>business name</ListItem>
            <ListItem>service category and suburb</ListItem>
            <ListItem>price and quote date</ListItem>
            <ListItem>whether the work went ahead</ListItem>
          </List>
          <Text>
            Your account email address is not displayed as part of a quote. Do
            not include names, phone numbers, email addresses, street
            addresses, invoice numbers, or other identifying information in
            public quote fields. We may remove or redact personal, sensitive,
            or inappropriate content.
          </Text>
        </PolicySection>

        <PolicySection title="5. Service providers and data location">
          <Text>
            How Much Mate uses third-party providers for database,
            authentication, security, moderation, and email services. Our
            primary application database is hosted in the Asia Pacific (Sydney)
            region, so application data is primarily stored and processed in
            Australia.
          </Text>
          <Text>
            We also use OpenAI for quote moderation, Cloudflare Turnstile for
            bot protection, and email infrastructure for account and moderation
            messages. These providers and their subprocessors may process
            information outside Australia where needed to provide, secure, or
            support their services.
          </Text>
        </PolicySection>

        <PolicySection title="6. Cookies and similar technologies">
          <Text>
            How Much Mate uses cookies and similar browser technologies where
            necessary to keep you signed in, maintain sessions, protect
            accounts, prevent misuse, and remember service-related state. We do
            not currently use advertising cookies.
          </Text>
        </PolicySection>

        <PolicySection title="7. How we share information">
          <Text>We do not sell your personal information.</Text>
          <Text>
            We share information with service providers only where reasonably
            necessary to operate and secure How Much Mate. We may also disclose
            information where required by law or where reasonably necessary to
            investigate fraud, security issues, or abuse.
          </Text>
        </PolicySection>

        <PolicySection title="8. Security and retention">
          <Text>
            We take reasonable steps to protect personal information through
            measures such as secure authentication, encrypted connections,
            database access controls, and restricted administrative access. No
            internet service can guarantee absolute security, and you are
            responsible for keeping your account credentials secure.
          </Text>
          <Text>
            We retain information for as long as reasonably necessary to
            provide and secure How Much Mate, maintain community pricing data,
            resolve disputes, and meet legal obligations. Quote information may
            be retained in de-identified form so historical pricing remains
            useful to the community.
          </Text>
        </PolicySection>

        <PolicySection title="9. Your information and quotes">
          <Text>
            You can update your username through your profile and edit or delete
            quotes you submitted through My Quotes. We may retain information
            where required for legal, fraud-prevention, security, or
            record-keeping purposes.
          </Text>
        </PolicySection>

        <PolicySection title="10. Changes to this policy">
          <Text>
            We may update this policy as How Much Mate, its technology, or
            legal requirements change. The latest version will be published on
            this page with its last-updated date.
          </Text>
        </PolicySection>
      </Stack>
    </Container>
  );
};

const PolicySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Stack component="section" gap="sm">
    <Title order={2}>{title}</Title>
    {children}
  </Stack>
);

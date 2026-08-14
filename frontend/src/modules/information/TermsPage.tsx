import { NextLink } from "@/components/NextLink";
import { Container, List, ListItem, Stack, Text, Title } from "@mantine/core";

export const TermsPage = () => {
  return (
    <Container component="article" size="md" py={{ base: "xl", md: 48 }}>
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={1}>Terms of Use</Title>
          <Text c="dimmed">Last updated: 14 August 2026</Text>
          <Text mt="sm">
            These Terms of Use apply when you access or use How Much Mate. By
            using How Much Mate, you agree to these Terms.
          </Text>
        </Stack>

        <TermsSection title="1. About How Much Mate">
          <Text>
            How Much Mate is a community-powered service that helps people
            compare prices and quotes for everyday services. Information may
            include prices, job descriptions, locations, business names, and
            other details submitted by members of the community.
          </Text>
          <Text>
            How Much Mate does not provide the services described in
            submissions, and its content is not professional or financial
            advice.
          </Text>
        </TermsSection>

        <TermsSection title="2. Community-submitted information">
          <Text>
            We may review or automatically check submissions before they are
            published, but we cannot independently verify every quote, price,
            job, or other detail. A published submission does not confirm that:
          </Text>
          <List spacing="xs">
            <ListItem>the quote is genuine or accurate</ListItem>
            <ListItem>the work was completed or the price was paid</ListItem>
            <ListItem>the same price will be available to you</ListItem>
            <ListItem>
              a service provider currently charges the displayed amount
            </ListItem>
            <ListItem>the price is fair or recommended</ListItem>
          </List>
          <Text>
            How Much Mate is a reference point only. Service prices vary with
            factors such as location, job size, complexity, materials, timing,
            access, provider, and market conditions. Obtain your own quotes and
            make your own assessment before engaging a provider.
          </Text>
        </TermsSection>

        <TermsSection title="3. Submitting information">
          <Text>When you submit information, you agree that:</Text>
          <List spacing="xs">
            <ListItem>it is accurate to the best of your knowledge</ListItem>
            <ListItem>you have the right to submit it</ListItem>
            <ListItem>
              you will not submit false, misleading, unlawful, abusive,
              defamatory, or inappropriate content
            </ListItem>
            <ListItem>
              you will not impersonate another person or business
            </ListItem>
            <ListItem>
              you will not include unnecessary personal or sensitive
              information about someone else
            </ListItem>
          </List>
          <Text>You are responsible for the information you submit.</Text>
        </TermsSection>

        <TermsSection title="4. Permission to publish your content">
          <Text>
            You keep any rights you hold in content you submit. You give How
            Much Mate a non-exclusive, worldwide, royalty-free licence to
            store, review, reproduce, edit, and display that content as needed
            to operate and improve the service.
          </Text>
          <Text>
            This permission continues while the content remains part of How
            Much Mate. Content may remain in a de-identified form after its
            connection to your account is removed.
          </Text>
        </TermsSection>

        <TermsSection title="5. Moderation">
          <Text>
            We may review submissions before or after publication. We may edit,
            redact, reject, hide, or remove content that we reasonably believe:
          </Text>
          <List spacing="xs">
            <ListItem>is inaccurate, misleading, duplicate, or spam</ListItem>
            <ListItem>contains personal or sensitive information</ListItem>
            <ListItem>is inappropriate, irrelevant, or unlawful</ListItem>
            <ListItem>could harm the integrity of How Much Mate</ListItem>
            <ListItem>breaches these Terms</ListItem>
          </List>
          <Text>
            We do not have to publish every submission. Moderation improves the
            quality of the service but does not guarantee accuracy.
          </Text>
        </TermsSection>

        <TermsSection title="6. Businesses and service providers">
          <Text>
            How Much Mate is not affiliated with, endorsed by, or acting for a
            business merely because that business is mentioned on the site.
            Unless clearly stated otherwise, we do not recommend, rank,
            approve, or guarantee any provider.
          </Text>
        </TermsSection>

        <TermsSection title="7. Accounts and acceptable use">
          <Text>
            You are responsible for providing accurate account information,
            keeping your login details secure, and activity through your
            account. You must not use another person&apos;s account without
            permission.
          </Text>
          <Text>You must not use How Much Mate to:</Text>
          <List spacing="xs">
            <ListItem>submit false or fabricated quotes</ListItem>
            <ListItem>
              manipulate pricing or unfairly promote or damage a business
            </ListItem>
            <ListItem>scrape or harvest information at unreasonable scale</ListItem>
            <ListItem>
              interfere with the service or attempt unauthorised access
            </ListItem>
            <ListItem>upload malicious code or act unlawfully</ListItem>
          </List>
          <Text>
            We may restrict access where reasonably necessary to protect users
            or the service, investigate misuse, meet legal requirements, or
            enforce these Terms.
          </Text>
        </TermsSection>

        <TermsSection title="8. Accuracy, availability, and your decisions">
          <Text>
            We aim to make How Much Mate useful and reliable, but do not
            guarantee that it will always be available, uninterrupted, or
            error-free. Information may be incomplete, outdated, incorrect, or
            unavailable, and features may change.
          </Text>
          <Text>
            You are responsible for decisions you make using information on How
            Much Mate. Consider your circumstances, make appropriate enquiries,
            and obtain your own quote or professional advice where needed.
          </Text>
        </TermsSection>

        <TermsSection title="9. Liability">
          <Text>
            To the maximum extent permitted by law, How Much Mate is not
            responsible for loss arising solely from reliance on
            community-submitted pricing or other information displayed on the
            service.
          </Text>
          <Text>
            Nothing in these Terms excludes, restricts, or modifies rights or
            remedies that cannot legally be excluded, including rights under
            the Australian Consumer Law.
          </Text>
        </TermsSection>

        <TermsSection title="10. Intellectual property">
          <Text>
            The How Much Mate name, branding, website design, software, and
            materials created by us remain our property or that of our
            licensors. You may use the service normally for personal use, but
            must not reproduce, republish, sell, or commercially exploit a
            substantial part without permission, except where allowed by law.
          </Text>
        </TermsSection>

        <TermsSection title="11. Privacy">
          <Text>
            Our handling of personal information is explained in our{" "}
            <NextLink href="/privacy">Privacy Policy</NextLink>.
          </Text>
        </TermsSection>

        <TermsSection title="12. Changes to these Terms">
          <Text>
            We may update these Terms as the service changes. The latest version
            will be published here with its last-updated date. We may provide
            additional notice if a change materially affects your rights or
            obligations.
          </Text>
        </TermsSection>
      </Stack>
    </Container>
  );
};

const TermsSection = ({
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

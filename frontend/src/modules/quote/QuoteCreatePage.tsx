import {
  Box,
  Container,
  Group,
  Paper,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconShieldCheck } from "@tabler/icons-react";
import { CreateQuoteDto } from "@/schema";
import type { CreateQuoteActionResult } from "./actions";
import { CreateQuoteForm } from "./components/CreateQuoteForm";

type QuoteCreatePageProps = {
  createQuoteAction: (
    data: CreateQuoteDto,
  ) => Promise<CreateQuoteActionResult | never>;
};

export const QuoteCreatePage = ({
  createQuoteAction,
}: QuoteCreatePageProps) => {
  return (
    <Box bg="#f8faf9" py={{ base: 0, sm: 32, lg: 48 }}>
      <Container size="lg">
        <Paper
          withBorder
          shadow="xs"
          p={{ base: 20, sm: 36, lg: 44 }}
          radius="lg"
        >
          <Group align="flex-start" gap="md" wrap="nowrap">
            <ThemeIcon radius="xl" size={50} visibleFrom="sm" color="hmw.6">
              <IconShieldCheck size={28} stroke={1.8} />
            </ThemeIcon>
            <Box>
              <Title fz={{ base: 24, sm: 28 }} order={1} lh={1.2}>
                Create a Quote
              </Title>
              <Text c="dimmed" mt={6} fz={{ base: "sm", sm: "md" }}>
                Share what you were quoted and help others nearby know
                roughly what to expect.
              </Text>
            </Box>
          </Group>

          <CreateQuoteForm createQuoteAction={createQuoteAction} />
        </Paper>
      </Container>
    </Box>
  );
};

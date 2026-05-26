import { Container, Title, Paper, Text } from "@mantine/core";
import { CreateProjectForm } from "./components/CreateQuoteForm";

export const QuoteCreatePage = () => {
  return (
    <Container size="sm">
      {/* for SEO */}

      <Paper withBorder shadow="md" p={30} radius="md" mt="sm" pos="relative">
        <Title fz="h4" order={1}>
          Create Project
        </Title>
        <Text c="dimmed">Share quotes and help the community</Text>
        <CreateProjectForm />
      </Paper>
    </Container>
  );
};

"use client";

import {
  Anchor,
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Group,
  NativeSelect,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconArrowRight,
  IconCheck,
  IconMapPin,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { CategoriesSection } from "./CategoriesSection";
import type { Category } from "@/service/category.server";
import type { Quote } from "@/service/admin-quote";
import { RecentlySharedQuotes } from "./RecentlySharedQuotes";

const states = [
  { value: "", label: "Suburb or state" },
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "WA", label: "Western Australia" },
  { value: "SA", label: "South Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "ACT", label: "Australian Capital Territory" },
  { value: "NT", label: "Northern Territory" },
];

const proofPoints = [
  "Real quotes from real people",
  "Local prices",
  "Free to use",
];

export const LandingPage = ({
  categories,
  recentQuotes,
  renderedAt,
}: {
  categories: Category[];
  recentQuotes: Quote[];
  renderedAt: string;
}) => {
  const router = useRouter();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();
    const formData = new FormData(event.currentTarget);

    formData.forEach((value, key) => {
      if (typeof value === "string" && value.trim()) {
        params.set(key, value.trim());
      }
    });

    const query = params.toString();
    router.push(query ? `/search?${query}` : "/search");
  };

  return (
    <>
      <Box
        component="section"
        style={{
          overflow: "hidden",
          background:
            "radial-gradient(circle at 76% 45%, rgba(179, 235, 211, .42), transparent 30%), linear-gradient(115deg, #f7fcfa 0%, #f4fbf8 55%, #fbfefd 100%)",
        }}
      >
        <Container size="xxl" py={{ base: 36, sm: 52, lg: 72 }}>
        <Grid align="center" gap={{ base: 0, lg: 36 }}>
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <Stack gap={0} pos="relative" style={{ zIndex: 3 }}>
              <Badge
                size="lg"
                variant="light"
                color="hmw"
                radius="xl"
                leftSection={<IconUsers size={17} stroke={1.8} />}
                tt="none"
                w="fit-content"
              >
                Community powered. 100% free to use.
              </Badge>

              <Title
                order={1}
                mt={{ base: 22, sm: 28 }}
                fz={{ base: 47, sm: 60, lg: 72 }}
                lh={1.12}
                fw={800}
                c="#111827"
                style={{ letterSpacing: "-0.05em" }}
              >
                Know what a job
                <br />
                should{" "}
                <Text component="span" inherit c="hmw.6">
                  cost.
                </Text>
              </Title>

              <Text
                mt={18}
                mb={34}
                maw={620}
                c="#536075"
                fz={{ base: 17, sm: 19 }}
                lh={1.55}
              >
                Compare community-submitted quotes for tradies and services in
              </Text>

              <Paper
                component="form"
                onSubmit={handleSearch}
                withBorder
                shadow="md"
                radius="md"
                p={{ base: 16, sm: 22 }}
              >
                <Grid align="flex-end" gap="md">
                  <Grid.Col span={{ base: 12, sm: 5 }}>
                    <TextInput
                      name="keyword"
                      label="What service do you need?"
                      placeholder="e.g. Electrician, fencing, cleaning"
                      leftSection={<IconSearch size={20} stroke={1.7} />}
                      size="md"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 4 }}>
                    <NativeSelect
                      name="state"
                      label="Where?"
                      data={states}
                      leftSection={<IconMapPin size={20} stroke={1.7} />}
                      size="md"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 3 }}>
                    <Button
                      type="submit"
                      size="md"
                      fullWidth
                      style={{
                        boxShadow: "0 8px 18px rgba(0, 142, 84, .2)",
                      }}
                    >
                      Search quotes
                    </Button>
                  </Grid.Col>
                </Grid>
              </Paper>

              <Group mt={26} gap={30} align="center">
                <Text fw={700} c="#273143">
                  Got a quote recently?
                </Text>
                <Anchor
                  href="/quote/create"
                  c="hmw.6"
                  underline="always"
                  style={{ textUnderlineOffset: 4 }}
                >
                  <Group gap={8} wrap="nowrap">
                    Share it and help the next mate.
                    <IconArrowRight size={17} />
                  </Group>
                </Anchor>
              </Group>

              <Group mt={{ base: 28, sm: 40 }} gap={34}>
                {proofPoints.map((item) => (
                  <Group key={item} gap={8} wrap="nowrap">
                    <ThemeIcon
                      variant="outline"
                      color="hmw"
                      radius="xl"
                      size={18}
                    >
                      <IconCheck size={12} />
                    </ThemeIcon>
                    <Text fz={14} c="#4d586a">
                      {item}
                    </Text>
                  </Group>
                ))}
              </Group>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 5 }} visibleFrom="lg">
            <Box pos="relative" h={560}>
              <Image
                src="/hmm-map.svg"
                alt="Example quote prices around Australia"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Grid.Col>
        </Grid>
        </Container>
      </Box>
      <CategoriesSection categories={categories} />
      <RecentlySharedQuotes quotes={recentQuotes} renderedAt={renderedAt} />
    </>
  );
};

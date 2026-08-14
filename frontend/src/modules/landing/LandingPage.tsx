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
import { useRouter } from "next/navigation";
import type { CSSProperties, FormEvent } from "react";

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

const pricePins: Array<{
  title: string;
  price: string;
  place: string;
  position: CSSProperties;
}> = [
  {
    title: "Split system install",
    price: "$2,150",
    place: "Perth, WA",
    position: { left: "1%", top: "3%" },
  },
  {
    title: "Fence replacement",
    price: "$1,800",
    place: "Newcastle, NSW",
    position: { right: "-3%", top: "28%" },
  },
  {
    title: "Bathroom renovation",
    price: "$8,750",
    place: "Geelong, VIC",
    position: { left: "43%", bottom: 0 },
  },
];

const mapPins = [
  { left: "16%", top: "52%" },
  { left: "54%", top: "23%" },
  { left: "59%", top: "66%" },
  { left: "84%", top: "46%" },
  { left: "83%", top: "62%" },
  { left: "75%", top: "72%" },
];

const australiaPolygon = `polygon(
  2% 43%, 6% 32%, 13% 26%, 22% 24%, 28% 17%,
  37% 20%, 43% 11%, 49% 17%, 56% 14%, 62% 23%,
  66% 18%, 70% 4%, 74% 23%, 80% 29%, 87% 37%,
  97% 44%, 93% 53%, 97% 62%, 91% 70%, 88% 80%,
  82% 89%, 75% 92%, 70% 86%, 64% 92%, 57% 89%,
  52% 79%, 45% 77%, 39% 82%, 34% 89%, 27% 85%,
  20% 78%, 16% 66%, 10% 62%, 6% 53%
)`;

const proofPoints = [
  "Real quotes from real people",
  "Local prices",
  "Free to use",
];

export const LandingPage = () => {
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

  return <Box
    component="section"
    mih={{ base: "calc(100vh - 65px)", md: "calc(100vh - 125px)" }}
    style={{
      overflow: "hidden",
      background:
        "radial-gradient(circle at 76% 45%, rgba(179, 235, 211, .42), transparent 30%), linear-gradient(115deg, #f7fcfa 0%, #f4fbf8 55%, #fbfefd 100%)",
    }}
  >
    <Container size="xxl" py={{ base: 36, sm: 52, lg: 72 }}>
      <Grid align="center" gap={{ base: 32, lg: 48 }}>
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
              should <Text component="span" inherit c="hmw.6">cost.</Text>
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
              maw={860}
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
              <Text fw={700} c="#273143">Got a quote recently?</Text>
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
                  <ThemeIcon variant="outline" color="hmw" radius="xl" size={18}>
                    <IconCheck size={12} />
                  </ThemeIcon>
                  <Text fz={14} c="#4d586a">{item}</Text>
                </Group>
              ))}
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col span={5} visibleFrom="lg">
          <Box
            pos="relative"
            h={510}
            role="img"
            aria-label="Example quote prices around Australia"
            style={{ isolation: "isolate" }}
          >
            <Box
              pos="absolute"
              inset="54px -8px 38px 0"
              style={{
                zIndex: 0,
                background: "linear-gradient(145deg, #d9f2e8 5%, #bde6d7 100%)",
                opacity: 0.82,
                clipPath: australiaPolygon,
                filter: "drop-shadow(0 18px 20px rgba(55, 126, 98, .1))",
              }}
            />
            <Box
              pos="absolute"
              right="18%"
              bottom={13}
              w={28}
              h={36}
              style={{
                zIndex: 0,
                background: "linear-gradient(145deg, #d3eee3, #b9e3d3)",
                opacity: 0.82,
                clipPath: "polygon(17% 8%, 72% 0, 96% 27%, 76% 79%, 44% 100%, 10% 67%, 0 28%)",
              }}
            />

            {mapPins.map((pin) => (
              <Box
                key={`${pin.left}-${pin.top}`}
                pos="absolute"
                c="hmw.6"
                style={{ ...pin, zIndex: 2, filter: "drop-shadow(0 3px 3px rgba(0,0,0,.1))" }}
              >
                <IconMapPin size={27} fill="currentColor" />
              </Box>
            ))}

            {pricePins.map((pin) => (
              <Paper
                component="article"
                key={pin.title}
                pos="absolute"
                withBorder
                shadow="md"
                radius="md"
                p="md"
                miw={155}
                style={{ ...pin.position, zIndex: 3 }}
              >
                <Text fz={12} fw={600} c="#374151">{pin.title}</Text>
                <Text fz={23} fw={700} c="hmw.6">{pin.price}</Text>
                <Text fz={12} c="#687386">{pin.place}</Text>
              </Paper>
            ))}
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  </Box>;
};

import z, { number, coerce, object } from "zod";
import { stringTrimmed, postgresDateSchema, InferType } from "./schema";
import { botTokenSchema } from "./auth.schema";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const profanityMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

// Shared field schemas
const titleSchema = stringTrimmed({ error: "Title is required" })
  .min(3, { message: "Title must be at least 3 characters long" })
  .max(255, { message: "Title must be at most 255 characters long" })
  .refine((value) => !profanityMatcher.hasMatch(value), {
    message: "Title cannot contain inappropriate language",
  });

const business_nameSchema = stringTrimmed({
  error: "Business name is required",
})
  .min(3, { message: "Business name must be at least 3 characters long" })
  .max(255, { message: "Business name must be at most 255 characters long" })
  .refine((value) => !profanityMatcher.hasMatch(value), {
    message: "Business name cannot contain inappropriate language",
  });

const descriptionSchema = stringTrimmed({
  error: "Description is required",
})
  .min(10, { message: "Description must be at least 10 characters long" })
  .max(1000, { message: "Description must be at most 1000 characters long" })
  .refine((value) => !profanityMatcher.hasMatch(value), {
    message: "Description cannot contain inappropriate language",
  });

const priceSchema = number()
  .positive({ message: "Price must be greater than zero" })
  .max(10_000_000, { message: "Price must be at most $10,000,000" });

const category_idSchema = coerce
  .number()
  .int()
  .positive({ message: "Category is required" });

const suburb_idSchema = stringTrimmed({ error: "Suburb is required" }).min(1, {
  message: "Suburb is required",
});

const confirmedSchema = coerce
  .boolean()
  .refine((value) => value === true, {
    message: "You must confirm this quote information before submitting",
  });

export const MIN_QUOTE_DATE = "2000-01-01";

const todayDateString = () => new Date().toISOString().slice(0, 10);

// Base quote fields shared between create and edit
const quoteFieldsSchema = {
  title: titleSchema,
  business_name: business_nameSchema,
  description: descriptionSchema,
  price: priceSchema,
  category_id: category_idSchema,

  suburb_id: suburb_idSchema,
  completed: coerce.boolean(),
  confirmed: confirmedSchema,
};

// Quote date must not be before 2000 or in the future, for both creating and
// editing a quote.
const quoteDateSchema = postgresDateSchema("Quote date is required")
  .refine((value) => value >= MIN_QUOTE_DATE, {
    message: "Quote date cannot be before the year 2000",
  })
  .refine((value) => value <= todayDateString(), {
    message: "Quote date cannot be in the future",
  });

// Schema for creating a quote
export const createQuoteSchema = object({
  ...quoteFieldsSchema,
  quote_date: quoteDateSchema,
  botToken: botTokenSchema,
});

// Schema for editing a quote
export const editQuoteSchema = object({
  ...quoteFieldsSchema,
  quote_date: quoteDateSchema,
});

// Schema for pagination query parameters
export const paginationSchema = object({
  page: coerce.number().int().positive().default(1),
  limit: coerce.number().int().positive().max(20).default(10),
});

const AU_STATES = [
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
  "TAS",
  "ACT",
  "NT",
] as const;

export type AUState = (typeof AU_STATES)[number];
export const RADIUS_OPTIONS = [5, 10, 20, 50, 100] as const;

export type RadiusKm = (typeof RADIUS_OPTIONS)[number];

const SEARCH_TYPES = ["state", "suburb"] as const;

const PUBLIC_QUOTES_SORT_VALUES = [
  "newest",
  "price_low",
  "price_high",
] as const;

export type SearchType = (typeof SEARCH_TYPES)[number];
export type PublicQuotesSortBy = (typeof PUBLIC_QUOTES_SORT_VALUES)[number];

// Schema for public quotes search
export const publicQuotesSearchSchema = object({
  page: coerce.number().int().positive().default(1),
  limit: coerce.number().int().positive().max(20).default(10),
  keyword: stringTrimmed().optional(),
  sort_by: z.enum(PUBLIC_QUOTES_SORT_VALUES).default("newest"),
  search_type: z.enum(SEARCH_TYPES).default("state"),
  state: z.enum(AU_STATES).optional().nullable(),
  category_id: coerce.number().int().positive().optional(),
  suburb_id: stringTrimmed().optional().nullable(),
  radius_km: stringTrimmed()
    .refine((val) => RADIUS_OPTIONS.map(String).includes(val), {
      message: "Radius must be one of: 5, 10, 20, 50, or 100 km",
    })
    .optional()
    .nullable(),
});

export const unpublishQuoteSchema = object({
  reason: stringTrimmed({ error: "Reason is required" }).min(3, {
    message: "Reason must be at least 3 characters long",
  }),
});

// Types for request DTOs
export type CreateQuoteDto = InferType<typeof createQuoteSchema>;
export type EditQuoteDto = InferType<typeof editQuoteSchema>;
export type PaginationDto = InferType<typeof paginationSchema>;
export type UnpublishQuoteDto = InferType<typeof unpublishQuoteSchema>;
export type PublicQuotesSearchDto = InferType<typeof publicQuotesSearchSchema>;

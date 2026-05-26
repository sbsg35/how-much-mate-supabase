import z, { number, coerce, object } from "zod";
import { stringTrimmed, postgresDateSchema, InferType } from "./schema";
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

const priceSchema = number().positive({
  message: "Price must be greater than zero",
});

const category_idSchema = coerce
  .number()
  .int()
  .positive({ message: "Category is required" });

const suburb_idSchema = stringTrimmed({ error: "Suburb is required" });

// Base quote fields shared between create and edit
const quoteFieldsSchema = {
  title: titleSchema,
  business_name: business_nameSchema,
  description: descriptionSchema,
  price: priceSchema,
  category_id: category_idSchema,

  suburb_id: suburb_idSchema,
  completed: coerce.boolean(),
  quote_date: postgresDateSchema("Quote date is required"),
};

// Schema for creating a quote
export const createQuoteSchema = object(quoteFieldsSchema);

// Schema for editing a quote
export const editQuoteSchema = object(quoteFieldsSchema);

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

export type SearchType = (typeof SEARCH_TYPES)[number];

// Schema for public quotes search
export const publicQuotesSearchSchema = object({
  page: coerce.number().int().positive().default(1),
  limit: coerce.number().int().positive().max(20).default(10),
  keyword: stringTrimmed().optional(),
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

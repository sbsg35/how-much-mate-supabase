import z, { coerce, object } from "zod";
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

const descriptionSchema = stringTrimmed({
  error: "Description is required",
})
  .min(10, { message: "Description must be at least 10 characters long" })
  .max(1000, { message: "Description must be at most 1000 characters long" })
  .refine((value) => !profanityMatcher.hasMatch(value), {
    message: "Description cannot contain inappropriate language",
  });

const category_idSchema = coerce
  .number()
  .int()
  .positive({ message: "Category is required" });

// Schema for creating a quote
export const createProjectSchema = object({
  title: titleSchema,
  description: descriptionSchema,
  category_id: category_idSchema,
  quote_date: postgresDateSchema("Quote date is required"),
});

export type CreateProjectDto = InferType<typeof createProjectSchema>;

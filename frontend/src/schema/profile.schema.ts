import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from "obscenity";
import { InferType, stringTrimmed } from "@/lib/schema";
import { object, preprocess } from "zod";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const usernameSchema = stringTrimmed()
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores",
  )
  .refine(
    (value) => {
      const containsProfanity = matcher.hasMatch(value);
      return !containsProfanity;
    },
    { message: "Username cannot contain profanity" },
  );

const nullableUsernameSchema = preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();
  return trimmedValue === "" ? null : trimmedValue;
}, usernameSchema.nullable().optional());

export const userUpdateSchema = object({
  username: nullableUsernameSchema,
});

export type UserUpdateDto = InferType<typeof userUpdateSchema>;

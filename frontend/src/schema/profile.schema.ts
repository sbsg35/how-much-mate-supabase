import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from "obscenity";
import { InferType, stringTrimmed } from "@/lib/schema";
import { object } from "zod";

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

export const userUpdateSchema = object({
  username: usernameSchema.optional(),
});

export type UserUpdateDto = InferType<typeof userUpdateSchema>;

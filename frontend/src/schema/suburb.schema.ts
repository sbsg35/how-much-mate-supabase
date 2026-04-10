import { object } from "zod";
import { stringTrimmed, InferType } from "./schema";

export const suburbSearchSchema = object({
  query: stringTrimmed({ required_error: "Search query is required" })
    .min(2, "Search query must be at least 2 characters")
    .max(50, "Search query must be at most 50 characters"),
});

export type SuburbSearchDto = InferType<typeof suburbSearchSchema>;

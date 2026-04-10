import { object } from "zod";
import { stringTrimmed, InferType } from "./schema";

export const categorySearchSchema = object({
  query: stringTrimmed().min(1).max(100),
});

// DTO for category search
export type CategorySearchDto = InferType<typeof categorySearchSchema>;

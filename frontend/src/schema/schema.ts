import { Schema, string, z, ZodError } from "zod";

export type InferType<T extends Schema> = z.infer<T>;

export const stringTrimmed = (params?: Parameters<typeof string>[0]) =>
  string(params).trim();

export const schemaFormatError = (err: ZodError) => err.issues[0].message;

// date schema for 'YYYY-MM-DD' format
export const postgresDateSchema = (error: string = "Date is required") =>
  stringTrimmed({ error }).refine(
    (v) => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(v)) return false;
      const date = new Date(v);
      return !isNaN(date.getTime());
    },
    {
      message: "Date must be in YYYY-MM-DD format",
    },
  );

import "server-only";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "@/lib/envlib";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function moderateContent(
  text: string,
): Promise<{ flagged: boolean }> {
  const response = await openai.moderations.create({
    input: text,
    model: "omni-moderation-latest",
  });

  return { flagged: response.results[0]?.flagged ?? false };
}

const reviewResultSchema = z.object({
  flagged: z.boolean(),
  reason: z.string().nullable(),
});

export async function reviewQuoteContent(params: {
  title: string;
  business_name: string;
  description: string;
  price: number;
  categoryName: string;
}): Promise<{ flagged: boolean; reason: string | null }> {
  const { title, business_name, description, price, categoryName } = params;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          `You are a content moderator for an Australian trade quote sharing platform. Users submit real quotes they received from tradespeople.
Respond with JSON: { "flagged": boolean, "reason": string | null }
Flag ONLY if: the text is spam/nonsense, or the price is completely implausible (e.g. $1 for a house renovation, $1,000,000 for basic cleaning).
Be very lenient with pricing. High or unusual prices are common for legitimate trades and services. Do NOT flag quotes just because prices seem high or unexpected. Only flag if the price is objectively impossible or the content is clearly spam/fake.
Set reason to null when not flagged.`,
      },
      {
        role: "user",
        content:
          `Category: ${categoryName}\nBusiness: ${business_name}\nTitle: ${title}\nPrice: $${price} AUD\nDescription: ${description}`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  try {
    const parsed = reviewResultSchema.safeParse(JSON.parse(content));
    if (!parsed.success) {
      console.error(
        "[quote.reviewQuoteContent] Unexpected response shape",
        {
          issues: parsed.error.issues,
          content,
        },
      );
      return { flagged: false, reason: null };
    }

    return parsed.data;
  } catch (error) {
    console.error(
      "[quote.reviewQuoteContent] Failed to parse JSON response",
      {
        error: error instanceof Error ? error.message : String(error),
        content,
      },
    );
    throw error;
  }
}

import { sendReviewEmail } from "@/modules/moderation/sendReviewEmail";
import { handleCallback, MessageMetadata } from "@vercel/queue";

export const POST = handleCallback(
    async (quote: { quoteId: string }, metadata: MessageMetadata) => {
        console.log({ metadata });
        await sendReviewEmail(quote?.quoteId);
    },
);

---
priority: P1
severity: MEDIUM
complexity: Small-Medium
status: open
---

# Quote content moderation and submission volume can be trivially bypassed at scale

## Location
- `frontend/src/modules/quote/actions.ts:14-15`
- `frontend/src/modules/quote/actions.ts:47-55` (rate limit — currently commented out)
- `frontend/src/modules/quote/actions.ts:66-78` (`shouldRunAiChecks`)

## Related Supabase object
`quote` table (`status`, `review_reason`, `review_source` columns)

## Description
Three controls compound into one gap:

1. Daily rate limiting (`isRateLimited`, 100 quotes/day) is fully implemented but **commented out** — currently no rate limit at all on `createQuoteAction`.
2. `createQuoteAction` is a Next.js Server Action with **no CAPTCHA/Turnstile check**. Turnstile is wired up for signup/login/forgot-password only (confirmed by repo-wide search — it never appears in the quote-creation form or `actions.ts`).
3. `shouldRunAiChecks` only runs OpenAI moderation + GPT review for a user's **first 5 quotes** (`AI_CHECKED_QUOTE_LIMIT = 5`). Every quote after that is auto-published with `status = "published"` and no content check beyond client-supplied zod field validation (length limits + a static profanity word list).

## Attack scenario
A scripted client creates an account, submits 5 quotes to exhaust the AI-checked quota, then submits unlimited further quotes directly to the server action — all auto-published, none passed through OpenAI moderation or GPT review, with no CAPTCHA or rate limit stopping automation.

## Impact
Spam/low-quality data pollution of the "community pricing" dataset (the core product value), and a path for a single account to post objectionable content that only the profanity regex list would catch — much weaker than the GPT/OpenAI checks the design otherwise relies on.

## Evidence
```ts
// const DAILY_QUOTE_LIMIT = 100;
// async function isRateLimited(userId: string): Promise<boolean> { ... }   // <- disabled
...
async function shouldRunAiChecks(userId: string): Promise<boolean> {
  const { data } = await supabaseAdminServerClient()
    .from("quote").select("quote_id").eq("profile_id", userId).limit(AI_CHECKED_QUOTE_LIMIT);
  return (data?.length ?? 0) < AI_CHECKED_QUOTE_LIMIT;   // false after 5 quotes -> no moderation run
}
```

## Remediation
Re-enable the rate limit (or replace with a stronger one), add Turnstile to the quote-creation form the same way it's used for auth, and either raise/remove the AI-check cap or fall back to a cheaper always-on check (e.g. always run the free OpenAI moderation endpoint, reserve the more expensive GPT review for the first N quotes).

## Confidence
High

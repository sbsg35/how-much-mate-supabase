---
priority: P1
severity: MEDIUM
complexity: Small-Medium
status: fixed
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

## Resolution
All three sub-fixes implemented in `frontend/src/modules/quote/actions.ts`:

1. **Rate limiting re-enabled.** `isRateLimited` uncommented and wired into `createQuoteAction` (100 quotes/day/user).
2. **Turnstile added to quote creation.** `createQuoteSchema` now requires a `botToken` field (`frontend/src/schema/quote.schema.ts`); `CreateQuoteForm.tsx` renders the widget the same way `SignupForm.tsx` does and disables submit until verified; `createQuoteAction` verifies the token server-side via a new `verifyTurnstileToken()` helper (`frontend/src/lib/turnstile.ts`) that calls Cloudflare's `siteverify` endpoint, gated behind a new required `TURNSTILE_SECRET_KEY` server env var.
3. **Moderation gap closed.** `checkContent` now always runs the free OpenAI moderation endpoint; only the more expensive GPT review is capped, and only for a user's first 5 quotes (`GPT_REVIEW_QUOTE_LIMIT`, renamed from `AI_CHECKED_QUOTE_LIMIT` for clarity). Previously, *both* checks were skipped entirely past the cap.

Note: `botToken` had to be excluded from the object spread before insert/update in both `actions.ts` and the (currently unused, see item 05) browser-side `service/quote.ts`, since it's not a `quote` table column.

**New required env var:** `TURNSTILE_SECRET_KEY` (server-only). Added to `.env.example` with instructions; local `.env` set to Cloudflare's published always-pass test secret (`1x0000000000000000000000000000000AA`, the same one already used in `supabase/config.toml` for auth). **A real secret must be set in dev/prod deployments** — get one from the Cloudflare Turnstile dashboard for the same site already used for `CLOUDFLARE_TURNSTILE_KEY`.

Verified end-to-end locally: created a test user via the Auth admin API, logged in through the browser, submitted a quote through the actual UI (Turnstile widget auto-verified via the test site key, submit button correctly gated on `isVerified`). Confirmed via network/DB inspection that the GPT review ran (this was the test user's first quote, within the cap), correctly flagged the placeholder test content as "not describing a real service," set `status = pending`, and sent the review email (visible in Mailpit). Also confirmed the new pending quote was still blocked by the P0 fix on the public route. Test quote and test user deleted afterward.

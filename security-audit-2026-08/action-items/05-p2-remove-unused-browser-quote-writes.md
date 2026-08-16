---
priority: P2
severity: LOW / INFO
complexity: Small
status: open
---

# Remove (or deliberately wire up) unused browser-side quote write functions

## Location
`frontend/src/service/quote.ts` — `createQuote`, `updateQuote`, `useCreateQuoteMutation`, `useUpdateQuoteMutation`

## Related Supabase object
`quote` table

## Description
`service/quote.ts` exports browser-client functions that insert/update `quote` directly using the anon/authenticated Supabase key. A repo-wide search shows the actual UI flows use the server actions (`createQuoteAction`, `updateQuoteAction`) instead — `useCreateQuoteMutation` and `useUpdateQuoteMutation` are not imported anywhere.

These functions currently fail closed only because there is no INSERT/UPDATE RLS policy on `quote` (see companion item `04-p2-missing-quote-rls-insert-update.md`). If that policy gap is ever closed without also removing or re-auditing this dead code, a future accidental import of these hooks would silently start working, bypassing the moderation logic (`checkContent`, `shouldRunAiChecks`) that only exists in the server-action path.

## Impact
Not currently exploitable — dead code, and currently blocked by the RLS gap. Risk is latent: it could quietly become live functionality that skips content moderation if the table gains write policies later.

## Remediation
Either delete `createQuote`, `updateQuote`, `useCreateQuoteMutation`, and `useUpdateQuoteMutation` from `frontend/src/service/quote.ts`, or, if browser-direct writes are intended for a future feature, route them through equivalent moderation checks and document why they bypass the server action.

## Confidence
Medium (usage confirmed via grep; intent behind keeping this code is unverified — flagging for a decision, not asserting it must be deleted)

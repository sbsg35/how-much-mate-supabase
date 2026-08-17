---
priority: P2
severity: LOW / INFO
complexity: Small
status: fixed
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

## Resolution
Re-confirmed both `createQuote`/`updateQuote` and their hooks (`useCreateQuoteMutation`/`useUpdateQuoteMutation`) had no importers anywhere outside `service/quote.ts` itself, then removed all four from `frontend/src/service/quote.ts`, along with the now-unused `CreateQuoteDto`/`EditQuoteDto` schema imports. `deleteQuote`, `useDeleteQuoteMutation`, `useMyQuotes`, `useUserQuote`, and `quoteQueryKeys` (all still in active use) were left untouched.

This closes the exact risk described above: with items 04's RLS status guard now in place, these functions would have failed (403) rather than silently bypassing moderation if ever wired up — but removing genuinely dead code is still the right call rather than relying on that guard as the only safety net.

Verified: `tsc --noEmit` and `eslint` clean (no new errors, same pre-existing unrelated warnings as before). Logged into the running app as a fresh test user and loaded `/user/my-quotes` (which uses `useMyQuotes` from the same file) — rendered correctly with no console errors, confirming the file still works end-to-end after the removal.

---
priority: P1
severity: LOW-MEDIUM
complexity: Small
status: open
---

# Edit flow allows quote dates outside the range enforced at creation

## Location
`frontend/src/schema/quote.schema.ts:57-85`

## Related Supabase object
`quote.quote_date` (checked only at the application layer — no DB constraint)

## Description
`createQuoteSchema` uses `createQuoteDateSchema`, which enforces `quote_date` is between `2000-01-01` and today (matching the recent commit "can't have old or future date quotes"). `editQuoteSchema` reuses the base `quoteFieldsSchema.quote_date`, which is plain `postgresDateSchema` with **no min/max refinement**. `updateQuoteAction` validates against `editQuoteSchema`, so editing an existing quote can set `quote_date` to any date, including far future or pre-2000 dates — the exact case creation was recently hardened against.

## Attack scenario
A user creates a valid quote, then calls "Edit" and sets `quote_date` to `2099-01-01` or `1970-01-01`; the update succeeds because the edit schema never checks the bound.

## Impact
Data-integrity/business-logic issue (skews "recent pricing" assumptions the search/sort UI relies on), not a security boundary — Low severity, but a direct regression against a control that was deliberately added.

## Evidence
```ts
const createQuoteDateSchema = postgresDateSchema(...)
  .refine((value) => value >= MIN_QUOTE_DATE, ...)
  .refine((value) => value <= todayDateString(), ...);

export const createQuoteSchema = object({ ...quoteFieldsSchema, quote_date: createQuoteDateSchema });
export const editQuoteSchema = object(quoteFieldsSchema); // quote_date here is unbounded
```

## Remediation
Reuse `createQuoteDateSchema` (or an equivalently bounded schema) for `editQuoteSchema.quote_date`.

## Confidence
High

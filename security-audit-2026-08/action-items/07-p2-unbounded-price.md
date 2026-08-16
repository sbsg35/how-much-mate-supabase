---
priority: P2
severity: LOW
complexity: Small
status: open
---

# No upper bound on submitted quote price

## Location
`frontend/src/schema/quote.schema.ts:40-42`

## Related Supabase object
`quote.price` (numeric, no CHECK constraint in migrations)

## Description
`priceSchema = number().positive()` only rejects zero/negative prices — there is no upper bound, either in the zod schema or as a database CHECK constraint. The GPT content-review prompt (`frontend/src/lib/moderation.ts`) is instructed to flag "objectively impossible" prices, but that check is skipped entirely once a user has passed the 5-quote AI-check threshold (see `02-p1-quote-spam-and-moderation-bypass.md`), leaving no guard at all for later submissions.

## Impact
Business-logic/data-integrity issue: absurd prices can pollute the "community pricing" dataset that is the core value of the product (e.g. skewing averages, min/max displays, or sort-by-price views). Not itself a security boundary.

## Remediation
Add a reasonable upper bound to `priceSchema` (e.g. `.max(1_000_000)` or a category-aware ceiling), and consider a matching DB-level `CHECK` constraint on `quote.price` as a backstop independent of the application layer.

## Confidence
High

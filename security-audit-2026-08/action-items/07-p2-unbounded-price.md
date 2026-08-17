---
priority: P2
severity: LOW
complexity: Small
status: fixed
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

## Resolution
Added `.max(10_000_000, ...)` to `priceSchema` in `frontend/src/schema/quote.schema.ts` (applies to both create and edit, since both derive from the shared field schema). Also added the recommended DB-level backstop directly on the `price` column's original definition in `supabase/migrations/20260329032954_initial_schema_setup.sql` — `check ("price" > 0 and "price" <= 10000000)` — rather than a new migration, per instruction (not in prod yet, so edited in place + local `db reset`, same approach as item 06). The column previously had no positivity or bound constraint at all at the DB layer.

Verified: existing seed data's price range (`$55.01`–`$124,964.11` across 184k rows) is well within the bound, so the constraint applied cleanly on `db reset` with no data conflicts. Directly tested the CHECK constraint via SQL post-reset — an insert at `$10,000,001` was rejected, `$10,000,000` (boundary) succeeded (then cleaned up). Directly tested the zod schema — `10,000,001` rejected, `10,000,000` (boundary) accepted. `tsc` and `eslint` clean.

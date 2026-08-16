---
priority: P0
severity: HIGH
complexity: Small
status: fixed
---

# Public quote page bypasses moderation status and ownership via service-role client

## Location
- `frontend/app/(public)/quote/[id]/page.tsx:44-53`
- `frontend/src/service/admin-quote.ts:84-112`

## Related Supabase object
`quote` table — bypasses the `quote_select_admin_or_owner` and `quote_select_with_moderation_permission` RLS policies (query runs on the service-role client, which ignores RLS entirely).

## Description
`getQuoteById()` queries `quote` using `supabaseAdminServerClient()` (service-role key) with **no filter on `status`** and **no ownership/permission check**. The public route `app/(public)/quote/[id]/page.tsx` calls this for any visitor with no auth check, and renders the full quote (title, description, business name, price, submitter username) regardless of whether the quote is `published`, `pending`, or `flagged`.

This is directly reachable, not just theoretical: `QuoteCard` (`frontend/src/modules/quote/components/QuoteCard.tsx:85-86`) always links to `/quote/${quote.quote_id}`, and it's the component used on the "My Quotes" page, which shows a user's own `pending` quotes (only `flagged` is excluded there — `frontend/src/service/quote.ts:186`). A user's own pending quote is one click away from a fully public, unauthenticated URL.

## Attack scenario
1. User submits a quote; moderation sends it to `pending` for review, or a quote is `flagged` after edit.
2. The quote shows on the user's "My Quotes" page, linking to `/quote/<uuid>`.
3. Anyone with that link — the submitter sharing it early, a link-preview bot (Slack/Discord/X unfurlers), or a search crawler hitting `generateMetadata` — gets the full content, even though a moderator has not approved it (or explicitly rejected it).
4. `generateMetadata()` (lines 12-42) builds Open Graph/Twitter meta tags from the same unfiltered data, embedding the content server-side into every request's `<head>`, independent of whether a human ever views the rendered page.

## Impact
Content-safety/moderation bypass — quotes flagged as policy-violating become fully public via a link the app itself hands out in its normal UI. Also exposes unapproved user submissions before review completes.

## Evidence
```ts
// frontend/src/service/admin-quote.ts
export async function getQuoteById(quote_id: string): Promise<{ data: Quote }> {
  const { data, error } = await supabaseAdminServerClient() // service-role: bypasses RLS
    .from("quote")
    .select(`*, category:category_id (...), suburb:suburb_id (...), profile:profile_id (username)`)
    .eq("quote_id", quote_id)
    .single();
  // no .eq("status", "published") — pending/flagged quotes are returned identically
```

## Remediation
Filter to `status = 'published'` unless the requester is the owner or a moderator. Point "My Quotes" cards for non-published quotes at the existing authenticated `/user/quote/[quote_id]` view instead of the public `/quote/[id]` route.

## Example fix
```ts
export async function getQuoteById(quote_id: string): Promise<{ data: Quote } | null> {
  const { data, error } = await supabaseAdminServerClient()
    .from("quote")
    .select(`*, category:category_id (...), suburb:suburb_id (...), profile:profile_id (username)`)
    .eq("quote_id", quote_id)
    .eq("status", "published")   // public route only ever serves published content
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  ...
}
```

## Confidence
High

## Resolution
Implemented in `frontend/src/service/admin-quote.ts` (`getQuoteById`) — added `.eq("status", "published")` and switched `.single()` to `.maybeSingle()`, returning `{ data: null }` for anything not published (which the page already turns into a 404 via `notFound()`). Also fixed `generateMetadata` in `frontend/app/(public)/quote/[id]/page.tsx` to explicitly handle the null case instead of relying on an incidental `TypeError` to fall into its catch block.

Correction from the original audit: the exposure path via "My Quotes" → `QuoteCard` → public `/quote/[id]` link was not actually present — "My Quotes" links to the authenticated `/user/quote/[quote_id]` edit route, and `QuoteCard` (used only on the landing page and search results) is fed exclusively by `find_published_quotes`, which already filters `status = 'published'`. The underlying vulnerability (no status/ownership check in `getQuoteById`) was still real and fixed regardless — any known quote UUID for a pending/flagged quote was fully viewable — but the concrete reachability example in the original report was inaccurate.

Verified locally: flipped a seeded quote to `pending` via the service-role REST API, confirmed `/quote/<id>` now 404s, confirmed a `published` quote still renders correctly, then reverted the test row back to `published`.

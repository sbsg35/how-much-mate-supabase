<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:module-structure-rules -->
# Module structure

Pages in `app/` are **thin async server components** — data fetching only. Rendering logic lives in `src/modules/{domain}/`.

## Rules

1. **`app/…/page.tsx`**: Fetch data, resolve params/searchParams, return a module component. No inline view components. No server actions.
2. **`src/modules/{domain}/actions.ts`**: All server actions for the domain. Must have `"use server"` at the top of the file.
3. **`src/modules/{domain}/{DomainNamePage}.tsx`**: View components. Named exports. No `"use client"` unless hooks or browser APIs are required.

## Example

```
app/(public)/quote/[id]/page.tsx          ← thin shell: fetches quote, returns <QuoteDetailPage />
src/modules/quote/QuoteDetailPage.tsx     ← view component: receives quote as props
src/modules/quote/actions.ts              ← "use server" actions
```

## Domains

| Domain | Route | Module |
|---|---|---|
| quote | `app/(public)/quote/` | `src/modules/quote/` |
| user | `app/(public)/user/` | `src/modules/user/` |
| auth | `app/auth/` | `src/modules/auth/` |
| moderation | `app/(public)/moderation/` | `src/modules/moderation/` |
<!-- END:module-structure-rules -->

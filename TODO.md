# TODO

## Cart sync route: Supabase-only auth (remove JWT fallback)
- [ ] Review `src/app/api/cart/sync/route.ts` and remove any JWT decoding/fallback logic.
- [ ] Replace session retrieval with Supabase SSR session (createServerClient + auth.getSession/getUser).
- [ ] Ensure route returns 401 when no user is authenticated.
- [ ] Keep cart storage behavior as-is (in-memory map).
- [ ] Run TypeScript/Next build or lint to verify compilation.


<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Booknook

Next.js 16 app (App Router, `next build` on Turbopack), single package, npm only (lockfile is `package-lock.json` — don't use pnpm/yarn/bun). No tests, no CI, no pre-commit hooks. README is stock create-next-app boilerplate; this file and `node_modules/next/dist/docs/` are the real docs.

## Commands

- `npm run dev` — dev server, open http://localhost:3000. Turbopack writes types under `.next/dev/types/`, which tsconfig includes.
- Verify changes with `npm run lint` then `npx tsc --noEmit` then `npm run build` (there is no `typecheck` script — must invoke tsc directly). `next build` catches route/paging errors tsc misses.
- `npm run lint` is plain `eslint` (flat config in `eslint.config.mjs`); pass `-- --fix` to autofix.

## Toolchain quirks (non-default config in next.config.ts)

- `cacheComponents: true` — data fetching is dynamic by default; opt into caching with the `use cache` directive. Do NOT use `experimental_ppr`, `experimental.ppr`, or `runtime = 'edge'` route segment exports (removed/incompatible). Details: `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md`.
- `reactCompiler: true` — React auto-memoizes; don't add manual `useMemo`/`useCallback` wrappers by default.
- Tailwind v4 via `@tailwindcss/turbopack` — there is no `tailwind.config.ts`; theme tokens/CSS variables live in `src/app/globals.css`.

## Components

- shadcn/ui with `style: "base-nova"` — components build on **@base-ui/react** (Base UI, not Radix) and import `cn` from the `"cn"` package (not `@/lib/utils`). Match this pattern in generated `src/components/ui/*` files.
- Add components with `npx shadcn add <name>` rather than hand-writing them; aliases: `@/components`, `@/components/ui`, `@/lib` (all map to `src/*`).

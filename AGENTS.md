# Bun Demo Agent Guide

This app was scaffolded with `remix new`. Use these conventions when continuing to build it out.

## Commands

```sh
bun install
bun run dev
bun run start
bun test
bun run typecheck
```

`bun test` is the only supported test runner. Tests import `describe`/`it` from
`remix/test`, which tsconfig.json aliases to `test/remix-test.ts` (a `bun:test`
shim). Do not run tests with the `remix test` CLI; it executes on Node and
fails on modules that touch Bun APIs.

Hot module replacement is not supported. `remix/node-hmr` supervises only
Node.js processes, and this app depends on Bun APIs. Use `bun run dev` for
watch-mode restarts.

## Building Features

Refer to ./.agents/skills/remix/SKILL.md

`.agents/skills/remix/` must be a verbatim copy of the official skill that
`remix new` generates for the installed `remix` version. Never edit, extend, or
trim it. When upgrading `remix`, replace the whole directory with the copy from
a fresh `remix new` scaffold of the same version.

## Starter Layout

- `app/actions/controller.tsx` owns the top-level route actions
- `app/actions/home-page.tsx` and `app/actions/document.tsx` render the route-owned starter UI
- `app/actions/public/` contains the browser runtime entry and interactive prompt button
- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs
- `app/router.ts` wires routes to route handlers and installs the standard Remix UI renderer used by actions
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware
- Root `public/` contains static files served unchanged from the app root

## Route Ownership

- Start from `app/routes.ts` and map each route to the narrowest owner on disk.
- Put top-level route actions in `app/actions/controller.tsx`.
- Add `app/actions/<route-key>/controller.tsx` for nested route maps that need their own actions or middleware.
- Keep route-owned page modules next to the route that owns them.
- Move shared UI to `app/ui/`, not `app/actions/`.

## Streaming

- Always stream data where possible. Avoid buffering request or response bodies in memory.
- Buffer only when the underlying APIs do not support streaming (for example, `Bun.TOML.parse` and `Bun.XML.parse` accept strings only). State the limitation in a comment where the buffering happens.

## Build-Out Notes

- This starter intentionally begins small; add directories like `app/data/` and `test/` only when you need them.
- Prefer putting code in the narrowest owner before introducing shared modules.
- Avoid generic dumping-ground directories like `app/lib/` or `app/components/`.

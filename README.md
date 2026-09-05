# Bun Demo

A demo of Bun-native runtime features, built with Remix v3 and deployed to Prisma Compute, which runs the Bun runtime.

The app deliberately installs no additional packages. Every feature is implemented with Bun's built-in APIs.

## Demos

Each demo lives on its own route:

- **Image Manipulation** — resize, rotate, modulate, and convert images with [`Bun.image`](https://bun.com/docs/runtime/image).
- **Markdown Converter** — convert Markdown to HTML and JSX with [`Bun.markdown`](https://bun.com/docs/runtime/markdown).
- **Color Converter** — convert between color formats with [`Bun.color`](https://bun.com/docs/runtime/color).
- **File Archiver** — upload files and produce an archive with [`Bun.Archive`](https://bun.com/docs/runtime/archive).
- **DNS Lookup** — resolve DNS records with [`dns`](https://bun.com/docs/runtime/networking/dns).
- **WebSocket Backpressure** — control the server's message rate with a slider, demonstrating [backpressure support](https://bun.com/docs/runtime/http/websockets#backpressure-1).
- **Format Converter** — convert between TOML, JSON, XML, and YAML using `Bun.TOML`, `Bun.JSON5`, `Bun.XML`, and `Bun.YAML`.

## Project Shape

- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs.
- `app/router.ts` wires routes to handlers and installs the standard Remix UI renderer used by actions.
- `app/actions/controller.tsx` owns the top-level route actions.
- `app/actions/<route-key>/controller.tsx` holds actions and middleware for nested route maps.
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware.
- Root `public/` contains static files served unchanged from the app root.

## Growing The App

- Map each route in `app/routes.ts` to the narrowest owner on disk.
- Keep route-owned page modules next to the route that owns them.
- Move shared UI into `app/ui/` once more than one route needs it.
- Prefer a Bun-native API over an npm package in all cases.

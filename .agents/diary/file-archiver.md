# file-archiver

- **Out-of-scope decision**: `remix test` (Node-based) fails repo-wide with "Bun is not defined" because controllers import Bun-API modules at top level (`dns-lookup/lookup.ts:45`, `Bun.Image`, etc.). Chose to standardize on `bun test` with a `bun:test` shim for `remix/test` instead of making the app modules Node-safe, since this project is explicitly a Bun demo.

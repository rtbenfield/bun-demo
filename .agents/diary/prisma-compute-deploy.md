**Out-of-scope decision:** Bun reads JSX settings from the working directory's tsconfig.json, and Compute boots from a directory above the copied tree. I fixed this with a Bun plugin in `boot.ts` instead of adding `@jsxImportSource` pragmas to 16 app files. Bundling the server was rejected because Remix client entries are identified by their module's `import.meta.url`, which bundling collapses.

**Out-of-scope decision:** Composer packages are dev dependencies only. The README says the app installs no extra packages, and `service.port()` is unnecessary because the Compute wrapper exports `PORT` before booting the app.

**Scope tangent:** `remix@3.0.0` pulls `playwright` and `esbuild` into production dependencies, so `dist/` is about 112 MB. Upstream concern, not fixable here.

**Scope tangent:** The deploy printed that alchemy 2.0.0-beta.81 is available (pinned 2.0.0-beta.78 by `@prisma/composer`). The CLI also reports Prisma agent skills out of date (`prisma skills sync`). Neither was acted on.

**Scope tangent:** Deploy-on-push (`prisma git connect`) was not set up. Deploys run from this machine with `bun run deploy`.

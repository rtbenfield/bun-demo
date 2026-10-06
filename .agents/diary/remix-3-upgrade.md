# Remix 3 Upgrade

- **Unrelated bug:** `AGENTS.md` listed `bun run hmr`, but `package.json` defined no `hmr` script. Running `node hmr.ts` crashed because `remix/node-hmr` starts the server under Node.js and the app uses Bun globals. The operator asked for cleanup, so all HMR wiring was removed.
- **Out-of-scope decision:** The `remix doctor` advice to declare `engines.node` was not applied. This app targets Bun and already declares `engines.bun`.
- **Out-of-scope decision:** The skill was replaced wholesale with the 3.0.0 scaffold version. The operator confirmed the skill must always be a verbatim copy of the official one. This rule is now in `AGENTS.md`.

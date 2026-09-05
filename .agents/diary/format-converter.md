# Format Converter

## [Buffering decision] Bun data-format APIs have no streaming mode

`Bun.TOML.parse/stringify`, `Bun.JSON5.parse/stringify`, `Bun.YAML.parse/stringify`, and `Bun.XML.parse/stringify` (bun-types 1.4.x) accept strings only and return in-memory values. Conversion therefore buffers the input document by necessity; the streaming rule in AGENTS.md permits this. Documented in `app/actions/format-converter/convert.ts`. Revisit if Bun ships streaming parsers.

## [Out-of-scope] Playwright added as devDependency for the remix test CLI

`bunx remix test --type server` unconditionally imports `playwright` (`@remix-run/test/dist/lib/playwright.js`) and crashes without it. Installed `playwright@1.63.0` as a devDependency (no browsers needed for `--type server`). If the README's "no additional packages" stance is meant to cover devDependencies too, this needs revisiting.

## [Code smell] Tests must run via `bun --bun x remix test`, not plain `remix test`

The default remix test worker runs under Node, where `Bun` globals are undefined. Bun-native features (TOML/YAML/XML/JSON5) can only be exercised by forcing Bun: `bun --bun x remix test --type server <file>`. Worth capturing in AGENTS.md or the remix skill later.

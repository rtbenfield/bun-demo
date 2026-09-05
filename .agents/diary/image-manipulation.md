# Test Runner Discrepancy

- **Unrelated bug**: AGENTS.md documents `bun test` as the test command, but plain `bun test` reports "0 tests across 3 files" because `remix/test` suites need the Remix runner. The working invocation is `bunx --bun remix test` (plain `bunx remix test` runs the worker under Node where the `Bun` global is missing). Worth fixing in AGENTS.md and/or a bunfig preload so `bun test` works directly.

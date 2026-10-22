# Dependency updates

- **Out-of-scope decision** — The upgrade was verified without a real `prisma deploy`. A deploy publishes to Prisma Compute, so it is outward-facing. Instead, the Composer node adapter's `assemble()` built the artifact into a scratch directory, and the assembled bundle was booted from its parent directory as Compute does.
- **Scope tangent** — `prisma` 8.0.0-rc.25 still reports Prisma agent skills as out of date and suggests `prisma skills sync`. The repo has no `skills-lock.json`, so the dependency update procedure does not cover agent skills. Syncing would add files under `.agents/skills/` next to the verbatim Remix skill.

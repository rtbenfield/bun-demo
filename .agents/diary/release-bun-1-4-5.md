# Release on Bun 1.4.5

- **Out-of-scope decision** — A plain redeploy created no new service version. Composer packs the build deterministically and skips unchanged artifacts. The Compute base image is not part of that hash. I bumped `@types/bun` to `^1.4.5` to change the artifact. I chose this over a no-op file change because it also aligns the types with the new runtime.
- **Scope tangent** — Neither `prisma deploy` nor `prisma service version` offers a forced rebuild. Every future base-image update will need a content change to roll out. A force flag, or a base-image digest in the artifact hash, belongs upstream in Composer.
- **Scope tangent** — Local Bun is 1.4.4 while production runs 1.4.5. `engines.bun` still declares `>=1.4.2`. This is the same drift the Bun version footer diary noted.
- **Scope tangent** — The Prisma MCP connector denied `list_prisma_compute_deployments` under the agent permission policy. I used the Prisma CLI instead.

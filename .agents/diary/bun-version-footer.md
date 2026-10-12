# Bun version footer

- **Scope tangent** — Production runs a different Bun build than local development. Prisma Compute serves Bun 1.4.3, while the local toolchain is Bun 1.4.2. `package.json` declares `"bun": ">=1.4.2"`, so nothing pins the two together.
- **Scope tangent** — The deploy printed two upgrade notices. `alchemy` 2.0.0-beta.81 is available over the installed 2.0.0-beta.78. Prisma agent skills report as out of date and suggest `prisma skills sync`.
- **Out-of-scope decision** — The footer is visible to every visitor, including the full Bun revision. The operator chose this over the startup-log alternative. Public runtime version disclosure helps attackers match known vulnerabilities, so revisit before this app handles real traffic.

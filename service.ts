import node from '@prisma/composer/node'
import { compute } from '@prisma/composer-prisma-cloud'

/**
 * The Bun server, booted from the tree `bun run build` assembles in `dist/`.
 * The asset pipeline compiles browser modules from source at runtime, so the
 * deploy ships the source tree with its production dependencies, not a bundle.
 * The deploy wrapper boots this module's default export, so it must stay the service.
 */
export default compute({
  name: 'web',
  deps: {},
  build: node({ module: import.meta.url, dir: 'dist', entry: 'boot.ts' }),
})

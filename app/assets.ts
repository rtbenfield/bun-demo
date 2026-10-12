import * as path from 'node:path'

import { createAssetServer } from 'remix/assets'

// Anchored to this file, not the working directory, so the deployed bundle resolves its own tree.
export const rootDir = path.resolve(import.meta.dirname, '..')
const nodeEnv = process.env.NODE_ENV ?? 'development'
const isDevelopment = nodeEnv === 'development'

export const assets = createAssetServer({
  basePath: '/assets',
  rootDir,

  allowFiles: ['app/routes.ts', 'app/**/public/**'],
  allowPackages: ['remix'],
  denyFiles: ['app/**/*.test.*'],
  sourceMaps: isDevelopment ? 'external' : undefined,
  minify: !isDevelopment,
  watch: isDevelopment,
})

const entry = 'app/actions/public/entry.ts'

export const entryHref = await assets.getHref(entry)
export const entryPreloads = await assets.getPreloads(entry)

import { plugin } from 'bun'

/**
 * Deployed entry. Bun takes JSX settings from the working directory's tsconfig.json,
 * and Prisma Compute boots from a directory above this tree, so `.tsx` modules would
 * compile against the React runtime and render nothing. This plugin compiles them with
 * this tree's tsconfig before the server loads them.
 */
const tsconfig = await Bun.file(new URL('./tsconfig.json', import.meta.url)).text()
const transpiler = new Bun.Transpiler({ loader: 'tsx', target: 'bun', autoImportJSX: true, tsconfig })

plugin({
  name: 'tsconfig-jsx',
  setup(build) {
    build.onLoad({ filter: /\.tsx$/ }, async ({ path }) => ({
      contents: transpiler.transformSync(await Bun.file(path).text()),
      loader: 'js',
    }))
  },
})

await import('./server.ts')

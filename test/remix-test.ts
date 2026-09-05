// Shim so the bun test runner can execute tests written against the
// `remix/test` API. Mapped in tsconfig.json under compilerOptions.paths.
// bun:test has no `before`/`after`/`suite`; they map to their nearest
// bun:test equivalents.
export {
  afterAll as after,
  afterAll,
  afterEach,
  beforeAll as before,
  beforeAll,
  beforeEach,
  describe,
  describe as suite,
  test,
  it,
} from 'bun:test'

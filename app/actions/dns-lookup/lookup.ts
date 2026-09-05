export const RECORD_TYPES = ['a', 'aaaa', 'cname', 'mx', 'ns', 'txt', 'srv', 'soa', 'caa', 'ptr'] as const

export type RecordType = (typeof RECORD_TYPES)[number]

export interface RecordEntry {
  main: string
  detail?: string
}

export interface LookupResult {
  type: RecordType
  records?: RecordEntry[]
  error?: string
}

type RecordFetcher = (hostname: string) => Promise<RecordEntry[]>

// Bun.dns.resolve* and its record-specific methods exist at runtime but are
// not yet declared in bun-types, so type them locally.
interface RecordResolver {
  resolve: (hostname: string) => Promise<{ address: string; ttl?: number }[]>
  // bun-types 1.4.x omits the `all` option on lookup even though the runtime
  // supports it, so type the multi-result call here.
  lookup: (hostname: string, options: { family: 6; all: true }) => Promise<{ address: string; ttl?: number }[]>
  resolveCname: (hostname: string) => Promise<string[]>
  resolveMx: (hostname: string) => Promise<{ priority: number; exchange: string }[]>
  resolveNs: (hostname: string) => Promise<string[]>
  resolveTxt: (hostname: string) => Promise<string[][]>
  resolveSrv: (
    hostname: string,
  ) => Promise<{ priority: number; weight: number; port: number; target: string }[]>
  resolveSoa: (hostname: string) => Promise<{
    serial: number
    refresh: number
    retry: number
    expire: number
    minttl: number
    nsname: string
    hostmaster: string
  }>
  resolveCaa: (hostname: string) => Promise<{ critical?: number; value?: string }[]>
  resolvePtr: (hostname: string) => Promise<string[]>
}

let dns = Bun.dns as typeof Bun.dns & RecordResolver

function addresses(records: { address: string; ttl?: number }[]): RecordEntry[] {
  return records.map((record) => ({
    main: record.address,
    detail: record.ttl == null ? undefined : `TTL ${record.ttl}`,
  }))
}

function names(records: string[]): RecordEntry[] {
  return records.map((record) => ({ main: record }))
}

const FETCHERS: Record<RecordType, RecordFetcher> = {
  a: async (hostname) => addresses(await dns.resolve(hostname)),
  // Bun.dns.resolve has no IPv6 mode in 1.4.x (it ignores a family option),
  // so AAAA records come from lookup with an explicit family filter.
  aaaa: async (hostname) =>
    addresses(await dns.lookup(hostname, { family: 6, all: true })),
  cname: async (hostname) => names(await dns.resolveCname(hostname)),
  mx: async (hostname) =>
    (await dns.resolveMx(hostname))
      .sort((a, b) => a.priority - b.priority)
      .map((record) => ({
        main: record.exchange,
        detail: `priority ${record.priority}`,
      })),
  ns: async (hostname) => names(await dns.resolveNs(hostname)),
  txt: async (hostname) =>
    (await dns.resolveTxt(hostname)).map((chunks) => ({ main: chunks.join('') })),
  srv: async (hostname) =>
    (await dns.resolveSrv(hostname)).map((record) => ({
      main: `${record.target}:${record.port}`,
      detail: `priority ${record.priority} · weight ${record.weight}`,
    })),
  soa: async (hostname) => {
    let record = await dns.resolveSoa(hostname)
    return [
      {
        main: record.nsname,
        detail: `serial ${record.serial} · hostmaster ${record.hostmaster}`,
      },
    ]
  },
  caa: async (hostname) =>
    (await dns.resolveCaa(hostname)).map((record) => ({
      main: record.value ?? JSON.stringify(record),
      detail: record.critical == null ? undefined : `critical ${record.critical}`,
    })),
  ptr: async (hostname) => names(await dns.resolvePtr(hostname)),
}

export async function lookupRecord(type: RecordType, hostname: string): Promise<LookupResult> {
  try {
    return { type, records: await FETCHERS[type](hostname) }
  } catch (error) {
    return { type, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function lookupAll(hostname: string): Promise<LookupResult[]> {
  return Promise.all(RECORD_TYPES.map((type) => lookupRecord(type, hostname)))
}

export function cacheStats(): RecordEntry[] {
  let stats = Bun.dns.getCacheStats()
  return [
    { main: 'Entries', detail: String(stats.size) },
    { main: 'Completed lookups served from cache', detail: String(stats.cacheHitsCompleted) },
    { main: 'In-flight lookups served from cache', detail: String(stats.cacheHitsInflight) },
    { main: 'Cache misses', detail: String(stats.cacheMisses) },
    { main: 'Cache errors', detail: String(stats.errors) },
  ]
}

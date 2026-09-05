# DNS Lookup

## [Code smell] `Bun.dns.resolve*` is untyped in bun-types 1.4.x

`Bun.dns` exposes `resolve`, `resolveMx`, `resolveSrv`, `resolveTxt`, `resolveSoa`, `resolveCaa`, `resolveNs`, `resolvePtr`, `resolveCname`, and `resolveAny` at runtime, but `bun-types` only declares `lookup`, `prefetch`, `getCacheStats`, and the flag constants. `app/actions/dns-lookup/lookup.ts` carries a local `RecordResolver` interface cast to work around it. Remove the cast once bun-types ships the declarations. Also note `Bun.dns.lookup`'s `all: true` option is untyped (and `resolve` ignores a `family` option, returning A records only), both covered by the same cast.

## [Code smell] `Bun.dns.resolve(hostname, { family: 6 })` returns A records

Verified on Bun 1.4.2: `resolve` ignores the `family` option and always returns IPv4 addresses, and there is no `resolve6`. AAAA results therefore come from `lookup(hostname, { family: 6, all: true })`.

**Out-of-scope decision:** Controller tests import the shared `router`, so they now print access-log lines to stdout. I left this as is. Silencing it would require a log sink option on the app router, which is a wider change than this task.

**Scope tangent:** `Prisma-Connecting-IP` is trusted as given. If the app is ever reachable without passing through the Prisma edge, clients can spoof it. Values are quoted in the log, so spoofing cannot forge extra fields. A trust boundary (for example, only accepting the header from known proxy addresses) would be a separate change.

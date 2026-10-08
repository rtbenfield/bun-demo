import { logger, type LoggerFunction } from 'remix/middleware/logger'

const PRISMA_HEADERS = ['Prisma-Request-ID', 'Prisma-Connecting-IP'] as const

/**
 * Access-log middleware that appends the Prisma edge headers to every line it writes.
 * The tagged log function is also installed as `context.logger`, so app logs carry
 * the same request ID and client IP for correlation with upstream records.
 */
export function requestLogger(log: LoggerFunction = console.log): ReturnType<typeof logger> {
  return (context, next) => {
    let tags = PRISMA_HEADERS.map((name) => formatTag(name, context.request.headers.get(name)))
      .join(' ')
    return logger({ log: (message) => log(`${message} ${tags}`) })(context, next)
  }
}

function formatTag(name: string, value: string | null): string {
  // Quoting stops client-supplied values from forging extra key=value pairs.
  return `${name.toLowerCase()}=${value === null ? '-' : JSON.stringify(value)}`
}

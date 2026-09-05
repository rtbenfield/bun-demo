import { router } from './app/router.ts'

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 44100

const server = Bun.serve({
  port,
  fetch: async (request) => {
    try {
      return await router.fetch(request)
    } catch (error) {
      if (!(request.signal.aborted && error === request.signal.reason)) {
        console.error(error)
      }
      return new Response('Internal Server Error', { status: 500 })
    }
  },
})

console.log(`Server listening on ${server.url}`)

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

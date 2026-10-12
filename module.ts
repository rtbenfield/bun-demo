import { module } from '@prisma/composer'

import web from './service.ts'

export default module('bun-demo', ({ provision }) => {
  provision(web)
})

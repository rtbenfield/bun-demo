import { createRouter, type MiddlewareContext } from 'remix/router'
import { render } from 'remix/middleware/render'
import { staticFiles } from 'remix/middleware/static'

import controller from './actions/controller.tsx'
import formatConverterController from './actions/format-converter/controller.tsx'
import dnsLookupController from './actions/dns-lookup/controller.tsx'
import markdownConverterController from './actions/markdown-converter/controller.tsx'
import colorConverterController from './actions/color-converter/controller.tsx'
import { assets } from './assets.ts'
import { routes } from './routes.ts'

const renderMiddleware = render({ assets })
type AppContext = MiddlewareContext<[typeof renderMiddleware]>

declare module 'remix/router' {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter<AppContext>({
  middleware: [staticFiles('./public', { index: false }), renderMiddleware],
})

router.map(routes, controller)
router.map(routes.formatConverter, formatConverterController)
router.map(routes.dnsLookup, dnsLookupController)
router.map(routes.markdownConverter, markdownConverterController)
router.map(routes.colorConverter, colorConverterController)

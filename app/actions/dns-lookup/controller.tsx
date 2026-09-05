import { createController } from 'remix/router'

import { routes } from '../../routes.ts'
import { cacheStats, lookupAll } from './lookup.ts'
import { DnsLookupPage } from './page.tsx'

export default createController(routes.dnsLookup, {
  actions: {
    index(context) {
      return context.render(<DnsLookupPage hostname="" />)
    },
    async action(context) {
      let form = await context.request.formData()
      let hostname = form.get('hostname')

      if (typeof hostname !== 'string' || hostname.trim() === '') {
        return context.render(
          <DnsLookupPage
            hostname={typeof hostname === 'string' ? hostname : ''}
            results={[{ type: 'a', error: 'Enter a hostname to look up.' }]}
          />,
          { status: 400 },
        )
      }

      let name = hostname.trim()
      return context.render(
        <DnsLookupPage hostname={name} results={await lookupAll(name)} cacheStats={cacheStats()} />,
      )
    },
  },
})

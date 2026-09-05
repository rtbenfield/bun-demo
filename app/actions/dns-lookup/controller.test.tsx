import { expect } from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../../router.ts'
import { routes } from '../../routes.ts'

describe('dns lookup route', () => {
  it('renders the empty lookup page', async () => {
    let response = await router.fetch('http://localhost' + routes.dnsLookup.index.href())
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('DNS Lookup')
  })

  it('rejects a missing hostname', async () => {
    let body = new FormData()
    body.set('hostname', '')

    let response = await router.fetch('http://localhost' + routes.dnsLookup.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(400)
    expect(await response.text()).toContain('Enter a hostname')
  })

  it('resolves every record type for a nonexistent host without throwing', async () => {
    let body = new FormData()
    body.set('hostname', 'does-not-exist.invalid')

    let response = await router.fetch('http://localhost' + routes.dnsLookup.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(200)
    let html = await response.text()
    for (let type of ['A', 'AAAA', 'MX', 'TXT', 'SRV', 'SOA']) {
      expect(html).toContain(type)
    }
    expect(html).toContain('error')
    expect(html).toContain('Resolver cache')
  })

  it('renders formatted rows for resolved records', async () => {
    let body = new FormData()
    body.set('hostname', 'bun.sh')

    let response = await router.fetch('http://localhost' + routes.dnsLookup.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(200)
    let html = await response.text()
    expect(html).toContain('TTL')
    expect(html).toContain('priority 1')
    expect(html).toContain('aspmx.l.google.com')
    expect(html).toContain('hans.ns.cloudflare.com')
  })
})

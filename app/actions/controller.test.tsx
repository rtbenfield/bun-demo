import { expect } from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../router.ts'
import { routes } from '../routes.ts'

describe('home route', () => {
  it('renders the Bun runtime version and revision in the footer', async () => {
    let response = await router.fetch('http://localhost' + routes.home.href())
    expect(response.status).toBe(200)

    let html = await response.text()
    expect(html).toContain('<footer')
    expect(html).toContain(Bun.version)
    expect(html).toContain(Bun.revision)
  })
})

import { expect } from 'remix/assert'
import { describe, it } from 'remix/test'

import { convertToAll } from './convert.ts'
import { router } from '../../router.ts'
import { routes } from '../../routes.ts'

const TOML_SAMPLE = `name = "server"
port = 8080
tags = ["a", "b"]`

const YAML_SAMPLE = `name: server
port: 8080
tags:
  - a
  - b`

describe('format converter route', () => {
  it('renders the empty converter page', async () => {
    let response = await router.fetch('http://localhost' + routes.formatConverter.index.href())
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('Format Converter')
  })

  it('converts a TOML document into every format', async () => {
    let body = new FormData()
    body.set('source', 'toml')
    body.set('content', TOML_SAMPLE)

    let response = await router.fetch('http://localhost' + routes.formatConverter.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(200)
    let html = await response.text()
    for (let format of ['TOML', 'JSON5', 'YAML', 'XML']) {
      expect(html).toContain(format)
    }
    expect(html).toContain('name: server')
  })

  it('reports a parse error without throwing', async () => {
    let body = new FormData()
    body.set('source', 'json5')
    body.set('content', '{nope')

    let response = await router.fetch('http://localhost' + routes.formatConverter.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(200)
    let html = await response.text()
    expect(html).toContain('error')
  })

  it('rejects a missing source format', async () => {
    let body = new FormData()
    body.set('source', 'ini')
    body.set('content', YAML_SAMPLE)

    let response = await router.fetch('http://localhost' + routes.formatConverter.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(400)
  })
})

describe('convertToAll', () => {
  it('round-trips YAML through every other format', () => {
    let results = convertToAll('yaml', YAML_SAMPLE)
    expect(results.map((r) => r.format)).toEqual(['toml', 'json5', 'yaml', 'xml'])
    for (let result of results) {
      expect(result.error).toBeUndefined()
      expect(result.output).toBeTruthy()
    }
  })
})

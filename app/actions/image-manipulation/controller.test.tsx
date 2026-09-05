import { expect } from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../../router.ts'
import { routes } from '../../routes.ts'
import { parseOptions } from './transform.ts'

const FIXTURE_PATH = 'test/fixtures/gradient-64x48.png'

function fixtureFile(): File {
  return new File([Bun.file(FIXTURE_PATH)], 'gradient.png', { type: 'image/png' })
}

describe('image manipulation route', () => {
  it('renders the empty manipulation page', async () => {
    let response = await router.fetch('http://localhost' + routes.imageManipulation.index.href())
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('Image Manipulation')
  })

  it('defaults the rotation select to 0', async () => {
    let response = await router.fetch('http://localhost' + routes.imageManipulation.index.href())
    let html = await response.text()
    expect(html).toContain('<option value="0" selected>0°</option>')
  })

  it('transforms an uploaded image', async () => {
    let body = new FormData()
    body.set('image', fixtureFile())
    body.set('width', '32')
    body.set('rotate', '90')
    body.set('format', 'webp')
    body.set('quality', '80')

    let response = await router.fetch('http://localhost' + routes.imageManipulation.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(200)
    let html = await response.text()
    expect(html).toContain('data:image/webp;base64,')
    expect(html).toContain('PNG')
    expect(html).toContain('WebP')
  })

  it('accepts a negative rotation', async () => {
    let body = new FormData()
    body.set('image', fixtureFile())
    body.set('rotate', '-90')
    body.set('format', 'png')

    let response = await router.fetch('http://localhost' + routes.imageManipulation.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(200)
    let html = await response.text()
    expect(html).toContain('48×64')
  })

  it('rejects a missing upload', async () => {
    let response = await router.fetch('http://localhost' + routes.imageManipulation.action.href(), {
      method: 'POST',
      body: new FormData(),
    })

    expect(response.status).toBe(400)
    expect(await response.text()).toContain('Choose an image')
  })

  it('rejects invalid transform options', async () => {
    let body = new FormData()
    body.set('image', fixtureFile())
    body.set('brightness', 'way too bright')

    let response = await router.fetch('http://localhost' + routes.imageManipulation.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(400)
    expect(await response.text()).toContain('brightness')
  })

  it('rejects height-only resize', async () => {
    let body = new FormData()
    body.set('image', fixtureFile())
    body.set('height', '24')

    let response = await router.fetch('http://localhost' + routes.imageManipulation.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(400)
    expect(await response.text()).toContain('width')
  })

  it('reports a decode failure without throwing', async () => {
    let body = new FormData()
    body.set('image', new File([new TextEncoder().encode('not an image')], 'fake.png'))

    let response = await router.fetch('http://localhost' + routes.imageManipulation.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(400)
    expect(await response.text()).toContain('Could not transform')
  })
})

describe('parseOptions', () => {
  it('applies defaults for empty forms', () => {
    let parsed = parseOptions(new FormData())
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.value.format).toBe('webp')
      expect(parsed.value.rotate).toBe(0)
      expect(parsed.value.width).toBeUndefined()
    }
  })

  it('clamps nothing but validates ranges', () => {
    let form = new FormData()
    form.set('quality', '0')
    expect(parseOptions(form).success).toBe(false)
  })
})

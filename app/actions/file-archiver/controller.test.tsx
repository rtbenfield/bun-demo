import { expect } from 'remix/assert'
import { describe, it } from 'remix/test'

import { router } from '../../router.ts'
import { routes } from '../../routes.ts'

function fileForm(): FormData {
  let body = new FormData()
  body.append('files', new File(['hello'], 'hello.txt'))
  body.append('files', new File(['world'], 'world.txt'))
  return body
}

describe('file archiver route', () => {
  it('renders the empty archiver page', async () => {
    let response = await router.fetch('http://localhost' + routes.fileArchiver.index.href())
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('File Archiver')
  })

  it('rejects a submission with no files', async () => {
    let response = await router.fetch('http://localhost' + routes.fileArchiver.action.href(), {
      method: 'POST',
      body: new FormData(),
    })

    expect(response.status).toBe(400)
    expect(await response.text()).toContain('Choose at least one file')
  })

  it('returns a plain tar attachment for uploaded files', async () => {
    let response = await router.fetch('http://localhost' + routes.fileArchiver.action.href(), {
      method: 'POST',
      body: fileForm(),
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/x-tar')
    expect(response.headers.get('Content-Disposition')).toContain('archive.tar')

    let blob = await response.blob()
    let archive = new Bun.Archive(blob)
    let entries = await archive.files()
    expect([...entries.keys()].sort()).toEqual(['hello.txt', 'world.txt'])
    expect(entries.get('hello.txt')?.size).toBe(5)
  })

  it('returns a gzipped tar archive when gzip is requested', async () => {
    let body = fileForm()
    body.set('gzip', 'on')

    let response = await router.fetch('http://localhost' + routes.fileArchiver.action.href(), {
      method: 'POST',
      body,
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/gzip')
    expect(response.headers.get('Content-Disposition')).toContain('archive.tar.gz')

    // Gzip data fails to parse as plain tar, but extracts cleanly as tar.gz.
    let blob = await response.blob()
    let archive = new Bun.Archive(blob)
    let entries = await archive.files()
    expect([...entries.keys()].sort()).toEqual(['hello.txt', 'world.txt'])
  })
})

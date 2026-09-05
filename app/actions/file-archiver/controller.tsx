import { createController } from 'remix/router'

import { routes } from '../../routes.ts'
import { collectFiles, createArchive } from './archive.ts'
import { FileArchiverPage } from './page.tsx'

export default createController(routes.fileArchiver, {
  actions: {
    index(context) {
      return context.render(<FileArchiverPage />)
    },
    async action(context) {
      let form = await context.request.formData()
      let collected = collectFiles(form)

      if (collected.error) {
        return context.render(<FileArchiverPage error={collected.error} />, { status: 400 })
      }

      let gzip = form.get('gzip') === 'on'

      try {
        let archive = await createArchive(collected.files, gzip)
        let bytes = new Uint8Array(await archive.blob.arrayBuffer())
        return new Response(bytes, {
          status: 200,
          headers: {
            'Content-Type': gzip ? 'application/gzip' : 'application/x-tar',
            'Content-Disposition': `attachment; filename="${archive.filename}"`,
            'Content-Length': String(bytes.byteLength),
          },
        })
      } catch (error) {
        let message = error instanceof Error ? error.message : String(error)
        return context.render(<FileArchiverPage error={`Could not create the archive: ${message}`} />, {
          status: 400,
        })
      }
    },
  },
})

import { createController } from 'remix/router'

import { routes } from '../../routes.ts'
import { parseOptions, transformImage, MAX_UPLOAD_BYTES, DEFAULT_OPTIONS } from './transform.ts'
import { ImageManipulationPage } from './page.tsx'

export default createController(routes.imageManipulation, {
  actions: {
    index(context) {
      return context.render(<ImageManipulationPage values={DEFAULT_OPTIONS} />)
    },
    async action(context) {
      let form = await context.request.formData()
      let file = form.get('image')

      let renderError = (message: string, status: number) =>
        context.render(<ImageManipulationPage values={DEFAULT_OPTIONS} error={message} />, {
          status,
        })

      if (!(file instanceof File) || file.size === 0) {
        return renderError('Choose an image to transform.', 400)
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        return renderError(`Image must be ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB or smaller.`, 400)
      }

      let options = parseOptions(form)
      if (!options.success) {
        return renderError(options.error, 400)
      }

      // Buffer the upload into bytes: Bun.Image decodes from bytes, and path
      // strings must never receive user-controlled input (arbitrary file read).
      let bytes = Buffer.from(await file.arrayBuffer())

      try {
        let result = await transformImage(bytes, options.value)
        return context.render(<ImageManipulationPage values={options.value} result={result} />)
      } catch (error) {
        let message = error instanceof Error ? error.message : String(error)
        return renderError(`Could not transform the image: ${message}`, 400)
      }
    },
  },
})

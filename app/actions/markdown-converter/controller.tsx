import { createController } from 'remix/router'

import { routes } from '../../routes.ts'
import { convert, type ConversionResult } from './convert.ts'
import { MarkdownPage } from './page.tsx'

export default createController(routes.markdownConverter, {
  actions: {
    index(context) {
      return context.render(<MarkdownPage markdown="" />)
    },
    async action(context) {
      // The form carries the markdown as a single textarea string; the
      // renderer buffers by design (see convert.ts).
      let form = await context.request.formData()
      let markdown = form.get('markdown')

      if (typeof markdown !== 'string' || markdown.trim() === '') {
        return context.render(
          <MarkdownPage
            markdown={typeof markdown === 'string' ? markdown : ''}
            results={[{ output: 'html', error: 'Provide some markdown to convert.' }]}
          />,
          { status: 400 },
        )
      }

      return context.render(<MarkdownPage markdown={markdown} results={convert(markdown)} />)
    },
  },
})

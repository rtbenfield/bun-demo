import { createController } from 'remix/router'

import { routes } from '../../routes.ts'
import { convertToAll, FORMATS, type ConversionResult, type Format } from './convert.ts'
import { ConverterPage } from './page.tsx'

function isFormat(value: FormDataEntryValue | null): value is Format {
  return FORMATS.includes(value as Format)
}

export default createController(routes.formatConverter, {
  actions: {
    index(context) {
      return context.render(<ConverterPage source="toml" content="" />)
    },
    async action(context) {
      // The form carries the document as a single textarea string; there is
      // nothing to stream here, and the parsers buffer by design (see convert.ts).
      let form = await context.request.formData()
      let source = form.get('source')
      let content = form.get('content')

      if (!isFormat(source) || typeof content !== 'string') {
        return context.render(
          <ConverterPage
            source={isFormat(source) ? source : 'toml'}
            content={typeof content === 'string' ? content : ''}
            results={[{ format: 'toml', error: 'Choose a source format and provide content.' }]}
          />,
          { status: 400 },
        )
      }

      return context.render(
        <ConverterPage source={source} content={content} results={convertToAll(source, content)} />,
      )
    },
  },
})

import { createController } from 'remix/router'

import { routes } from '../../routes.ts'
import { convert } from './convert.ts'
import { ColorPage } from './page.tsx'

export default createController(routes.colorConverter, {
  actions: {
    index(context) {
      return context.render(<ColorPage color="orange" />)
    },
    async action(context) {
      let form = await context.request.formData()
      let color = form.get('color')

      if (typeof color !== 'string' || color.trim() === '') {
        return context.render(
          <ColorPage
            color={typeof color === 'string' ? color : ''}
            results={[{ format: 'css', error: 'Provide a color to convert.' }]}
          />,
          { status: 400 },
        )
      }

      return context.render(<ColorPage color={color} results={convert(color)} />)
    },
  },
})

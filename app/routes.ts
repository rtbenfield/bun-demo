import { form, get, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  markdownConverter: form('markdown-converter'),
  colorConverter: form('color-converter'),
  formatConverter: form('format-converter'),
  dnsLookup: form('dns-lookup'),
  imageManipulation: form('image-manipulation'),
})

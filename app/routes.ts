import { form, get, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  formatConverter: form('format-converter'),
  dnsLookup: form('dns-lookup'),
})

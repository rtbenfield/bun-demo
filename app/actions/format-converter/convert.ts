export const FORMATS = ['toml', 'json5', 'yaml', 'xml'] as const

export type Format = (typeof FORMATS)[number]

export interface ConversionResult {
  format: Format
  output?: string
  error?: string
}

// Bun.TOML.parse, Bun.JSON5.parse, Bun.YAML.parse, and Bun.XML.parse accept
// strings only and return in-memory values, so conversion buffers the input.
export function parse(source: Format, text: string): unknown {
  switch (source) {
    case 'toml':
      return Bun.TOML.parse(text)
    case 'json5':
      return Bun.JSON5.parse(text)
    case 'yaml':
      return Bun.YAML.parse(text)
    case 'xml':
      return Bun.XML.parse(text)
  }
}

export function serialize(format: Format, value: unknown): string {
  switch (format) {
    case 'toml':
      return Bun.TOML.stringify(value) ?? ''
    case 'json5':
      return Bun.JSON5.stringify(value, null, 2) ?? ''
    case 'yaml':
      // Bun.YAML.stringify emits flow-style (single-line) YAML without a
      // space argument; pass one to get block style.
      return Bun.YAML.stringify(value, null, 2)
    case 'xml':
      return Bun.XML.stringify(xmlDocument(value), null, 2) ?? ''
  }
}

// XML requires exactly one root element. Parsed XML documents already have
// one; wrap multi-key objects from other sources under a <root> element.
function xmlDocument(value: unknown): unknown {
  if (typeof value !== 'object' || value === null) return value
  let keys = Object.keys(value)
  if (keys.length === 1) return value
  return { root: value }
}

export function convertToAll(source: Format, text: string): ConversionResult[] {
  let value: unknown
  try {
    value = parse(source, text)
  } catch (error) {
    return FORMATS.map((format) => ({
      format,
      error: error instanceof Error ? error.message : String(error),
    }))
  }

  return FORMATS.map((format) => {
    try {
      return { format, output: serialize(format, value) }
    } catch (error) {
      return {
        format,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  })
}

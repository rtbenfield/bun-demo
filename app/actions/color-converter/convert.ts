export const FORMATS = ['css', 'hex', 'rgb', 'hsl', 'lab', 'number', 'ansi'] as const

export type Format = (typeof FORMATS)[number]

export interface ConversionResult {
  format: Format
  text?: string
  error?: string
}

// Bun.color parses its input into an in-memory color value, so conversion
// buffers the input. It returns null when the input is not a valid color.
export function convert(input: string): ConversionResult[] {
  return FORMATS.map((format) => {
    let output = Bun.color(input, format)
    if (output === null) {
      return { format, error: `"${input}" is not a recognized color.` }
    }
    return { format, text: output }
  })
}

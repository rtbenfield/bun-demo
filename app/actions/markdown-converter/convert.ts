export interface ConversionResult {
  output: 'html' | 'ansi'
  text?: string
  error?: string
}

// Bun.markdown.html and Bun.markdown.ansi return in-memory strings, so
// conversion buffers the input.
export function convert(markdown: string): ConversionResult[] {
  return (
    [
      ['html', () => Bun.markdown.html(markdown)],
      ['ansi', () => Bun.markdown.ansi(markdown)],
    ] as const
  ).map(([output, render]) => {
    try {
      return { output, text: render() }
    } catch (error) {
      return { output, error: error instanceof Error ? error.message : String(error) }
    }
  })
}

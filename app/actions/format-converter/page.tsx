import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'

import { Document } from '../document.tsx'
import { FORMATS, type ConversionResult, type Format } from './convert.ts'

export interface ConverterPageProps {
  source: Format
  content: string
  results?: ConversionResult[]
}

export function ConverterPage(handle: Handle<ConverterPageProps>) {
  return () => {
    let { source, content, results } = handle.props

    return (
      <Document title="Format Converter">
        <main mix={pageStyle}>
          <h1 mix={headingStyle}>Format Converter</h1>
          <p mix={introStyle}>
            Paste a TOML, JSON5, YAML, or XML document and convert it into every other format with{' '}
            <code>Bun.TOML</code>, <code>Bun.JSON5</code>, <code>Bun.YAML</code>, and{' '}
            <code>Bun.XML</code>.
          </p>
          <form method="post" action="/format-converter" mix={formStyle}>
            <label mix={labelStyle}>
              Source format
              <select name="source" value={source} mix={controlStyle}>
                {FORMATS.map((format) => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
            <label mix={labelStyle}>
              Document
              <textarea
                name="content"
                rows={14}
                value={content}
                placeholder={'# Paste your document here'}
                mix={controlStyle}
              />
            </label>
            <button type="submit" mix={buttonStyle}>
              Convert to all formats
            </button>
          </form>
          {results ? <Results results={results} /> : null}
        </main>
      </Document>
    )
  }
}

function Results(handle: Handle<{ results: ConversionResult[] }>) {
  return () => (
    <section mix={resultsStyle}>
      {handle.props.results.map((result) => (
        <Result key={result.format} result={result} />
      ))}
    </section>
  )
}

function Result(handle: Handle<{ result: ConversionResult }>) {
  let { result } = handle.props

  return () => (
    <article mix={resultCardStyle}>
      <h2 mix={resultHeaderStyle}>{result.format.toUpperCase()}</h2>
      {result.error ? (
        <p mix={errorStyle}>{result.error}</p>
      ) : (
        <pre mix={preStyle}>
          <code>{result.output}</code>
        </pre>
      )}
    </article>
  )
}

const FONT_STACK =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"

const pageStyle = css({
  '--surface-0': '#dee2e6',
  '--surface-3': '#f0f4f7',
  '--surface-4': '#f7fbff',
  '--text-primary': '#313539',
  '--text-tertiary': '#94989c',
  '--brand-blue': '#2dacf9',
  '@media (prefers-color-scheme: dark)': {
    '--surface-0': '#1e2226',
    '--surface-3': '#313539',
    '--surface-4': '#363a3e',
    '--text-primary': '#dee2e6',
    '--text-tertiary': '#94989c',
  },
  margin: 0,
  padding: '48px 24px',
  minHeight: '100vh',
  background: 'var(--surface-0)',
  color: 'var(--text-primary)',
  fontFamily: FONT_STACK,
  fontSize: '14px',
  lineHeight: 1.5,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  maxWidth: '820px',
  marginInline: 'auto',
  width: '100%',
  boxSizing: 'border-box',
})

const headingStyle = css({
  margin: '12px 0 0',
  fontSize: '14px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
})

const introStyle = css({
  margin: 0,
  color: 'var(--text-tertiary)',
  textAlign: 'center',
  maxWidth: '640px',
  '& code': { color: 'var(--text-primary)' },
})

const formStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  maxWidth: '640px',
  marginTop: '24px',
})

const labelStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  fontWeight: 700,
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

const controlStyle = css({
  fontFamily: FONT_STACK,
  fontSize: '13px',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid transparent',
  background: 'var(--surface-4)',
  color: 'var(--text-primary)',
  resize: 'vertical',
  '&:focus-visible': { outline: 'none', borderColor: 'var(--brand-blue)' },
})

const buttonStyle = css({
  alignSelf: 'flex-start',
  fontFamily: FONT_STACK,
  fontSize: '13px',
  fontWeight: 700,
  padding: '10px 18px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  background: 'var(--brand-blue)',
  color: '#ffffff',
  '&:hover': { filter: 'brightness(1.1)' },
})

const resultsStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
  maxWidth: '640px',
  marginTop: '16px',
})

const resultCardStyle = css({
  background: 'var(--surface-3)',
  borderRadius: '14px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
})

const resultHeaderStyle = css({
  margin: 0,
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'var(--text-tertiary)',
})

const preStyle = css({
  margin: 0,
  padding: '12px',
  borderRadius: '10px',
  background: 'var(--surface-4)',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontSize: '12px',
})

const errorStyle = css({
  margin: 0,
  padding: '12px',
  borderRadius: '10px',
  background: 'var(--surface-4)',
  color: '#e5484d',
  fontSize: '12px',
})

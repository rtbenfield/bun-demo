import type { Handle } from 'remix/component'
import { css } from 'remix/component'

import { Document } from '../document.tsx'
import type { LookupResult, RecordEntry } from './lookup.ts'

export interface DnsLookupPageProps {
  hostname: string
  results?: LookupResult[]
  cacheStats?: RecordEntry[]
}

export function DnsLookupPage(handle: Handle<DnsLookupPageProps>) {
  return () => {
    let { hostname, results, cacheStats } = handle.props

    return (
      <Document title="DNS Lookup">
        <main mix={pageStyle}>
          <h1 mix={headingStyle}>DNS Lookup</h1>
          <p mix={introStyle}>
            Resolve a hostname into every DNS record type with <code>Bun.dns</code>, the built-in
            DNS resolver on the <code>dns</code> module.
          </p>
          <form method="post" action="/dns-lookup" mix={formStyle}>
            <label mix={labelStyle}>
              Hostname
              <input
                type="text"
                name="hostname"
                value={hostname}
                placeholder="bun.sh"
                spellcheck={false}
                autocomplete="off"
                mix={controlStyle}
              />
            </label>
            <button type="submit" mix={buttonStyle}>
              Look up all record types
            </button>
          </form>
          {results ? <Results results={results} /> : null}
          {cacheStats ? <CacheStats stats={cacheStats} /> : null}
        </main>
      </Document>
    )
  }
}

function Results(handle: Handle<{ results: LookupResult[] }>) {
  return () => (
    <section mix={resultsStyle}>
      {handle.props.results.map((result) => (
        <Result key={result.type} result={result} />
      ))}
    </section>
  )
}

function Result(handle: Handle<{ result: LookupResult }>) {
  let { result } = handle.props

  return () => (
    <article mix={resultCardStyle}>
      <h2 mix={resultHeaderStyle}>{result.type.toUpperCase()}</h2>
      {result.error ? (
        <p mix={errorStyle}>{result.error}</p>
      ) : result.records && result.records.length > 0 ? (
        <RecordList records={result.records} />
      ) : (
        <p mix={emptyStyle}>No records found.</p>
      )}
    </article>
  )
}

function RecordList(handle: Handle<{ records: RecordEntry[] }>) {
  return () => (
    <ul mix={recordListStyle}>
      {handle.props.records.map((record) => (
        <li mix={recordRowStyle}>
          <span mix={recordMainStyle}>{record.main}</span>
          {record.detail ? <span mix={recordDetailStyle}>{record.detail}</span> : null}
        </li>
      ))}
    </ul>
  )
}

function CacheStats(handle: Handle<{ stats: RecordEntry[] }>) {
  return () => (
    <article mix={resultCardStyle}>
      <h2 mix={resultHeaderStyle}>Resolver cache</h2>
      <RecordList records={handle.props.stats} />
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

const recordListStyle = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
})

const recordRowStyle = css({
  display: 'flex',
  gap: '12px',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderRadius: '8px',
  '&:nth-child(odd)': { background: 'var(--surface-4)' },
})

const recordMainStyle = css({
  fontSize: '13px',
  wordBreak: 'break-all',
})

const recordDetailStyle = css({
  flexShrink: 0,
  fontSize: '11px',
  color: 'var(--text-tertiary)',
  whiteSpace: 'nowrap',
})

const emptyStyle = css({
  margin: 0,
  padding: '12px',
  borderRadius: '10px',
  background: 'var(--surface-4)',
  color: 'var(--text-tertiary)',
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

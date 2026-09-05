import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'

import { Document } from '../document.tsx'

export interface FileArchiverPageProps {
  error?: string
}

export function FileArchiverPage(handle: Handle<FileArchiverPageProps>) {
  return () => {
    let { error } = handle.props

    return (
      <Document title="File Archiver">
        <main mix={pageStyle}>
          <h1 mix={headingStyle}>File Archiver</h1>
          <p mix={introStyle}>
            Bundle files into a tar archive with <code>Bun.Archive</code>, optionally gzipped, and
            download the result. Everything runs in-process with Bun's native archiver.
          </p>
          {/* data-rmx-document opts out of frame navigation so the browser
              handles the attachment response as a download. */}
          <form
            method="post"
            action="/file-archiver"
            encType="multipart/form-data"
            data-rmx-document
            mix={formStyle}
          >
            <label mix={labelStyle}>
              Files
              <input
                type="file"
                name="files"
                multiple
                mix={controlStyle}
              />
            </label>
            <label mix={checkboxLabelStyle}>
              <input type="checkbox" name="gzip" value="on" defaultChecked mix={checkboxStyle} />
              Gzip compress (<code>.tar.gz</code>)
            </label>
            {error ? <p mix={errorStyle}>{error}</p> : null}
            <button type="submit" mix={buttonStyle}>
              Create archive
            </button>
          </form>
        </main>
      </Document>
    )
  }
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

const checkboxLabelStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  '& code': { color: 'var(--text-primary)' },
})

const checkboxStyle = css({
  width: '16px',
  height: '16px',
  accentColor: 'var(--brand-blue)',
})

const controlStyle = css({
  fontFamily: FONT_STACK,
  fontSize: '13px',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid transparent',
  background: 'var(--surface-4)',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  '&:focus-visible': { outline: 'none', borderColor: 'var(--brand-blue)' },
  '&::file-selector-button': {
    fontFamily: 'inherit',
    fontSize: '12px',
    padding: '6px 12px',
    marginRight: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    background: 'var(--brand-blue)',
    color: '#ffffff',
  },
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

const errorStyle = css({
  margin: 0,
  padding: '12px',
  borderRadius: '10px',
  background: 'var(--surface-4)',
  color: '#e5484d',
  fontSize: '12px',
})

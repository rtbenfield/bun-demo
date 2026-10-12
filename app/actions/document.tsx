import type { Handle, RemixNode } from 'remix/component'
import { css } from 'remix/component'

import { entryHref, entryPreloads } from '../assets.ts'

export interface DocumentProps {
  children?: RemixNode
  head?: RemixNode
  title?: string
}

const DEFAULT_TITLE = readAppDisplayName('Bun%20Demo')

export function Document(handle: Handle<DocumentProps>) {
  return () => {
    let { children, head, title = DEFAULT_TITLE } = handle.props

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="color-scheme" content="light dark" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <title>{title}</title>
          {head}
          {entryPreloads.map((href) => (
            <link key={href} rel="modulepreload" href={href} />
          ))}
          <script type="module" src={entryHref}></script>
        </head>
        <body mix={css({ margin: 0 })}>
          {children}
          <RuntimeFooter />
        </body>
      </html>
    )
  }
}

/** Identifies the Bun build serving the page, so a deployed release can be matched to its runtime. */
function RuntimeFooter() {
  return () => (
    <footer
      mix={css({
        padding: '16px 24px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        fontSize: '12px',
        textAlign: 'center',
        color: '#94989c',
      })}
    >
      Bun {Bun.version} · revision {Bun.revision}
    </footer>
  )
}

function readAppDisplayName(value: string): string {
  return value.startsWith('%%') ? 'Remix App' : decodeURIComponent(value)
}

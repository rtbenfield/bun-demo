import type { Handle, RemixNode } from 'remix/ui'
import { css } from 'remix/ui'

import { routes } from '../routes.ts'
import { Document } from './document.tsx'

const FONT_STACK =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"

interface Feature {
  name: string
  href: string
  description: string
}

const FEATURES: Feature[] = [
  {
    name: 'Markdown Converter',
    href: routes.markdownConverter.index.href({}),
    description: 'Convert Markdown to HTML using the built-in parser.',
  },
  {
    name: 'Color Converter',
    href: routes.colorConverter.index.href({}),
    description: 'Convert colors between hex, rgb, and hsl formats.',
  },
  {
    name: 'Format Converter',
    href: routes.formatConverter.index.href({}),
    description: 'Convert JSON to and from TOML and YAML with Bun.TOML.',
  },
  {
    name: 'DNS Lookup',
    href: routes.dnsLookup.index.href({}),
    description: 'Resolve a hostname into every DNS record type with Bun.dns.',
  },
  {
    name: 'Image Manipulation',
    href: routes.imageManipulation.index.href({}),
    description: 'Resize, crop, and transform images with the built-in image API.',
  },
  {
    name: 'File Archiver',
    href: routes.fileArchiver.index.href({}),
    description: 'Pack and extract archives with Bun.Zip and Bun.Tar.',
  },
]

export function HomePage() {
  return () => (
    <Document head={<HomeHead />} title="Bun Demo">
      <main
        mix={css({
          // Light-mode design tokens (default).
          '--surface-0': '#dee2e6',
          '--surface-3': '#f0f4f7',
          '--surface-4': '#f7fbff',
          '--text-primary': '#313539',
          '--text-tertiary': '#94989c',
          '--brand-blue': '#2dacf9',
          // Dark-mode overrides.
          '@media (prefers-color-scheme: dark)': {
            '--surface-0': '#1e2226',
            '--surface-3': '#313539',
            '--surface-4': '#363a3e',
            '--text-primary': '#dee2e6',
            '--text-tertiary': '#94989c',
          },
          '& *, & *::before, & *::after': { boxSizing: 'border-box' },
          margin: 0,
          padding: '48px 24px',
          minHeight: '100vh',
          background: 'var(--surface-0)',
          color: 'var(--text-primary)',
          fontFamily: FONT_STACK,
          fontSize: '14px',
          lineHeight: 1.5,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        })}
      >
        <div
          mix={css({
            width: '100%',
            maxWidth: '680px',
            display: 'flex',
            flexDirection: 'column',
            gap: '48px',
          })}
        >
          <Masthead />
          <FeatureList />
        </div>
      </main>
    </Document>
  )
}

function HomeHead() {
  return () => (
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
    />
  )
}

function Masthead() {
  return () => (
    <section
      aria-label="Welcome"
      mix={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      })}
    >
      <h1
        mix={css({
          margin: 0,
          fontWeight: 700,
          fontSize: '24px',
          lineHeight: 1.33,
          color: 'var(--text-primary)',
        })}
      >
        Bun Demo
      </h1>
      <p
        mix={css({
          margin: 0,
          fontSize: '14px',
          lineHeight: 1.67,
          color: 'var(--text-tertiary)',
        })}
      >
        A demo of what the platform can do. Pick a feature below to try it out.
      </p>
    </section>
  )
}

function FeatureList() {
  return () => (
    <section
      aria-label="Features"
      mix={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      })}
    >
      {FEATURES.map((feature) => (
        <FeatureLink key={feature.href} feature={feature} />
      ))}
    </section>
  )
}

function FeatureLink(handle: Handle<{ feature: Feature }>) {
  return () => {
    let { name, href, description } = handle.props.feature

    return (
      <a
        href={href}
        mix={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'var(--surface-3)',
          color: 'var(--text-primary)',
          textDecoration: 'none',
          transition: 'background-color 150ms ease',
          '&:hover, &:focus-visible': {
            background: 'var(--surface-4)',
            '& .name': { color: 'var(--brand-blue)' },
            outline: 'none',
          },
        })}
      >
        <span className="name" mix={css({ fontWeight: 700, fontSize: '14px' })}>
          {name}
        </span>
        <span mix={css({ fontSize: '12px', lineHeight: 1.6, color: 'var(--text-tertiary)' })}>
          {description}
        </span>
      </a>
    )
  }
}

import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'

import { Document } from '../document.tsx'
import { FITS, FORMATS, ROTATIONS, type TransformResult, type TransformOptions } from './transform.ts'
import { Slider } from './public/slider.tsx'

export interface ImageManipulationPageProps {
  values: TransformOptions
  error?: string
  result?: TransformResult
}

export function ImageManipulationPage(handle: Handle<ImageManipulationPageProps>) {
  return () => {
    let { values, error, result } = handle.props

    return (
      <Document title="Image Manipulation">
        <main mix={pageStyle}>
          <h1 mix={headingStyle}>Image Manipulation</h1>
          <p mix={introStyle}>
            Upload an image and resize, rotate, flip, and modulate it with <code>Bun.Image</code>,
            the built-in image pipeline for JPEG, PNG, WebP, and more.
          </p>
          <form
            method="post"
            action="/image-manipulation"
            enctype="multipart/form-data"
            mix={formStyle}
          >
            <label mix={labelStyle}>
              Image
              <input type="file" name="image" accept="image/*" mix={controlStyle} />
            </label>
            <fieldset mix={fieldsetStyle}>
              <legend mix={legendStyle}>Resize</legend>
              <div mix={gridStyle}>
                <label mix={labelStyle}>
                  Width (px)
                  <input
                    type="number"
                    name="width"
                    min={1}
                    max={8192}
                    value={values.width ?? ''}
                    placeholder="auto"
                    mix={controlStyle}
                  />
                </label>
                <label mix={labelStyle}>
                  Height (px)
                  <input
                    type="number"
                    name="height"
                    min={1}
                    max={8192}
                    value={values.height ?? ''}
                    placeholder="auto"
                    mix={controlStyle}
                  />
                </label>
                <label mix={labelStyle}>
                  Fit
                  <select name="fit" value={values.fit} mix={controlStyle}>
                    {FITS.map((fit) => (
                      <option key={fit} value={fit}>
                        {fit}
                      </option>
                    ))}
                  </select>
                </label>
                <label mix={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    name="withoutEnlargement"
                    checked={values.withoutEnlargement}
                  />
                  Never upscale
                </label>
              </div>
            </fieldset>
            <fieldset mix={fieldsetStyle}>
              <legend mix={legendStyle}>Geometry</legend>
              <div mix={gridStyle}>
                <label mix={labelStyle}>
                  Rotate
                  <select name="rotate" value={values.rotate} mix={controlStyle}>
                    {ROTATIONS.map((angle) => (
                      <option key={angle} value={angle} selected={angle === values.rotate}>
                        {angle}&deg;
                      </option>
                    ))}
                  </select>
                </label>
                <label mix={checkboxLabelStyle}>
                  <input type="checkbox" name="flip" checked={values.flip} />
                  Flip vertically
                </label>
                <label mix={checkboxLabelStyle}>
                  <input type="checkbox" name="flop" checked={values.flop} />
                  Flop horizontally
                </label>
              </div>
            </fieldset>
            <fieldset mix={fieldsetStyle}>
              <legend mix={legendStyle}>Color</legend>
              <div mix={gridStyle}>
                <Slider
                  label="Brightness"
                  name="brightness"
                  min={0}
                  max={3}
                  step={0.05}
                  value={values.brightness}
                />
                <Slider
                  label="Saturation"
                  name="saturation"
                  min={0}
                  max={3}
                  step={0.05}
                  value={values.saturation}
                />
              </div>
            </fieldset>
            <fieldset mix={fieldsetStyle}>
              <legend mix={legendStyle}>Output</legend>
              <div mix={gridStyle}>
                <label mix={labelStyle}>
                  Format
                  <select name="format" value={values.format} mix={controlStyle}>
                    {FORMATS.map((format) => (
                      <option key={format} value={format}>
                        {format.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>
                <label mix={labelStyle}>
                  Quality (JPEG / WebP)
                  <input
                    type="number"
                    name="quality"
                    min={1}
                    max={100}
                    value={values.quality}
                    mix={controlStyle}
                  />
                </label>
              </div>
            </fieldset>
            <button type="submit" mix={buttonStyle}>
              Transform image
            </button>
          </form>
          {error ? <p mix={errorStyle}>{error}</p> : null}
          {result ? <Result result={result} /> : null}
        </main>
      </Document>
    )
  }
}

function Result(handle: Handle<{ result: TransformResult }>) {
  let { result } = handle.props

  return () => (
    <section mix={resultStyle}>
      <article mix={resultCardStyle}>
        <h2 mix={resultHeaderStyle}>Source</h2>
        <p mix={metaStyle}>
          {result.source.format.toUpperCase()} &middot; {result.source.width}&times;
          {result.source.height}
        </p>
        <img src={result.sourceDataUrl} alt="Source image" mix={imageStyle} />
      </article>
      <article mix={resultCardStyle}>
        <h2 mix={resultHeaderStyle}>Result</h2>
        <p mix={metaStyle}>
          {result.format.toUpperCase()} &middot; {result.width}&times;{result.height} &middot;{' '}
          {(result.bytes / 1024).toFixed(1)} KB
        </p>
        <img src={result.dataUrl} alt="Transformed result" mix={imageStyle} />
        <a href={result.dataUrl} download={`transformed.${result.format}`} mix={downloadStyle}>
          Download result
        </a>
      </article>
    </section>
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

const fieldsetStyle = css({
  margin: 0,
  padding: '16px',
  borderRadius: '14px',
  border: 'none',
  background: 'var(--surface-3)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

const legendStyle = css({
  padding: 0,
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--text-tertiary)',
})

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '12px',
  alignItems: 'end',
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
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  cursor: 'pointer',
  '& input': { accentColor: 'var(--brand-blue)', width: '16px', height: '16px' },
})

const controlStyle = css({
  fontFamily: FONT_STACK,
  fontSize: '13px',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid transparent',
  background: 'var(--surface-4)',
  color: 'var(--text-primary)',
  width: '100%',
  boxSizing: 'border-box',
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

const errorStyle = css({
  margin: '8px 0 0',
  padding: '12px',
  borderRadius: '10px',
  background: 'var(--surface-3)',
  color: '#e5484d',
  fontSize: '12px',
  maxWidth: '640px',
  width: '100%',
})

const resultStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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

const metaStyle = css({
  margin: 0,
  fontSize: '12px',
  color: 'var(--text-primary)',
})

const imageStyle = css({
  display: 'block',
  maxWidth: '100%',
  borderRadius: '10px',
  background: 'var(--surface-4)',
})

const downloadStyle = css({
  alignSelf: 'flex-start',
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--brand-blue)',
  textDecoration: 'none',
  '&:hover, &:focus-visible': { textDecoration: 'underline', outline: 'none' },
})

export const FITS = ['fill', 'inside'] as const
export const FORMATS = ['png', 'jpeg', 'webp'] as const
export const ROTATIONS = [-180, -90, 0, 90, 180] as const

export type Fit = (typeof FITS)[number]
export type OutputFormat = (typeof FORMATS)[number]
export type Rotation = (typeof ROTATIONS)[number]

export interface TransformOptions {
  width?: number
  height?: number
  fit: Fit
  withoutEnlargement: boolean
  rotate: Rotation
  flip: boolean
  flop: boolean
  brightness: number
  saturation: number
  format: OutputFormat
  quality: number
}

export const DEFAULT_OPTIONS: TransformOptions = {
  fit: 'inside',
  withoutEnlargement: false,
  rotate: 0,
  flip: false,
  flop: false,
  brightness: 1,
  saturation: 1,
  format: 'webp',
  quality: 80,
}

export interface SourceMetadata {
  width: number
  height: number
  format: string
}

export interface TransformResult {
  source: SourceMetadata
  sourceDataUrl: string
  dataUrl: string
  width: number
  height: number
  format: OutputFormat
  bytes: number
}

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
export const MAX_PIXELS = 4096 * 4096

const MIME_TYPES: Record<OutputFormat, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}

type ParseResult<T> = { success: true; value: T } | { success: false; error: string }

function numberField(form: FormData, name: string, min: number, max: number): number | undefined {
  let raw = form.get(name)
  if (typeof raw !== 'string' || raw.trim() === '') return undefined
  let value = Number(raw)
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${name} must be a number between ${min} and ${max}.`)
  }
  return value
}

function boolField(form: FormData, name: string): boolean {
  return form.get(name) !== null
}

export function parseOptions(form: FormData): ParseResult<TransformOptions> {
  try {
    let width = numberField(form, 'width', 1, 8192)
    let height = numberField(form, 'height', 1, 8192)

    if (height !== undefined && width === undefined) {
      return {
        success: false,
        error: 'Resizing requires a width; height-only resize is not supported.',
      }
    }

    let rotateRaw = form.get('rotate')
    let rotate = ROTATIONS.includes(Number(rotateRaw) as Rotation) ? (Number(rotateRaw) as Rotation) : 0

    let formatRaw = form.get('format')
    let format: OutputFormat =
      typeof formatRaw === 'string' && FORMATS.includes(formatRaw as OutputFormat)
        ? (formatRaw as OutputFormat)
        : DEFAULT_OPTIONS.format

    let fitRaw = form.get('fit')
    let fit: Fit =
      typeof fitRaw === 'string' && FITS.includes(fitRaw as Fit)
        ? (fitRaw as Fit)
        : DEFAULT_OPTIONS.fit

    return {
      success: true,
      value: {
        width,
        height,
        fit,
        withoutEnlargement: boolField(form, 'withoutEnlargement'),
        rotate,
        flip: boolField(form, 'flip'),
        flop: boolField(form, 'flop'),
        brightness: numberField(form, 'brightness', 0, 3) ?? DEFAULT_OPTIONS.brightness,
        saturation: numberField(form, 'saturation', 0, 3) ?? DEFAULT_OPTIONS.saturation,
        format,
        quality: numberField(form, 'quality', 1, 100) ?? DEFAULT_OPTIONS.quality,
      },
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export async function transformImage(
  bytes: Buffer,
  options: TransformOptions,
): Promise<TransformResult> {
  let image = new Bun.Image(bytes, { maxPixels: MAX_PIXELS })
  let source = await image.metadata()

  if (options.rotate !== 0) image = image.rotate(options.rotate)
  if (options.flip) image = image.flip()
  if (options.flop) image = image.flop()

  if (options.width !== undefined) {
    image = image.resize(options.width, options.height, {
      fit: options.fit,
      withoutEnlargement: options.withoutEnlargement,
    })
  }

  if (options.brightness !== 1 || options.saturation !== 1) {
    image = image.modulate({ brightness: options.brightness, saturation: options.saturation })
  }

  switch (options.format) {
    case 'png':
      image = image.png()
      break
    case 'jpeg':
      image = image.jpeg({ quality: options.quality })
      break
    case 'webp':
      image = image.webp({ quality: options.quality })
      break
  }

  // Encoding materializes the full output in memory by design; the decode and
  // encode work itself runs off the JavaScript thread. The upload is buffered
  // into bytes because Bun.Image must not receive user-controlled path strings.
  let encoded = await image.bytes()
  let dataUrl = `data:${MIME_TYPES[options.format]};base64,${Buffer.from(encoded).toString('base64')}`

  // Re-encode the original bytes straight into a data URL for the preview.
  // The format comes from Bun's sniffing, not the client-provided filename.
  let sourceDataUrl = `data:image/${source.format};base64,${bytes.toString('base64')}`

  return {
    source: { width: source.width, height: source.height, format: source.format },
    sourceDataUrl,
    dataUrl,
    width: image.width,
    height: image.height,
    format: options.format,
    bytes: encoded.length,
  }
}

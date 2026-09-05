export const MAX_FILE_BYTES = 2 * 1024 * 1024
export const MAX_TOTAL_BYTES = 10 * 1024 * 1024
export const MAX_FILES = 20

export interface CollectedFiles {
  files: File[]
  error?: string
}

export function collectFiles(form: FormData): CollectedFiles {
  let submitted = form.getAll('files').filter((entry): entry is File => entry instanceof File)
  let files = submitted.filter((file) => file.size > 0)

  if (files.length === 0) {
    return { files: [], error: 'Choose at least one file to archive.' }
  }
  if (files.length > MAX_FILES) {
    return { files: [], error: `Archive at most ${MAX_FILES} files at a time.` }
  }
  for (let file of files) {
    if (file.size > MAX_FILE_BYTES) {
      return { files: [], error: `"${file.name}" is larger than ${MAX_FILE_BYTES / (1024 * 1024)} MB.` }
    }
  }
  let total = files.reduce((sum, file) => sum + file.size, 0)
  if (total > MAX_TOTAL_BYTES) {
    return { files: [], error: `Total upload must be ${MAX_TOTAL_BYTES / (1024 * 1024)} MB or smaller.` }
  }

  return { files }
}

export interface ArchiveResult {
  blob: Blob
  filename: string
  byteLength: number
}

export async function createArchive(files: File[], gzip: boolean): Promise<ArchiveResult> {
  // Duplicate basenames would silently overwrite each other in the object form
  // of `new Bun.Archive`, so namespace entries by their upload order.
  let data: Bun.ArchiveInput = {}
  let seen = new Map<string, number>()
  for (let file of files) {
    let count = seen.get(file.name) ?? 0
    seen.set(file.name, count + 1)
    data[count === 0 ? file.name : `${file.name}.${count}`] = file
  }

  let archive = new Bun.Archive(data, gzip ? { compress: 'gzip' } : undefined)
  let blob = await archive.blob()
  let filename = gzip ? 'archive.tar.gz' : 'archive.tar'
  return { blob, filename, byteLength: blob.size }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

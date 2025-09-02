import { readMultipartFormData } from 'h3'
import { createErrorResponse, createSuccessResponse } from '../utils/response'
import { requireAuth } from '../utils/auth.middleware'
import { mkdir, writeFile, unlink } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { execFile } from 'node:child_process'

export default defineEventHandler(async (event) => {
  // Require auth for uploads
  await requireAuth(event)

  try {
    const form = await readMultipartFormData(event)
    if (!form || form.length === 0) {
      setResponseStatus(event, 400)
      return createErrorResponse('No files uploaded', 'NO_FILES')
    }

    const uploadDir = `${process.cwd()}/public/uploads/${new Date().toISOString().slice(0,10)}`
    await mkdir(uploadDir, { recursive: true })

    const urls: string[] = []
    const maxSizeBytes = 50 * 1024 * 1024 // 50MB
    const allowedTypes = [
      // Images
      /^image\/(png|jpe?g|webp|gif|avif|heic|heif)$/i,
      // Videos
      /^video\/(mp4|webm|quicktime|x-m4v)$/i,
      // Audio (add broader support incl. mp4/mpeg/m4a/3gpp)
      /^audio\/(mp3|mpeg|wav|ogg|oga|m4a|aac|webm|mp4|x-m4a|3gpp|3gpp2)$/i
    ]

    function mimeFromFilename(name: string): string | undefined {
      const ext = extname(name || '').toLowerCase()
      switch (ext) {
        case '.png': return 'image/png'
        case '.jpg':
        case '.jpeg': return 'image/jpeg'
        case '.webp': return 'image/webp'
        case '.gif': return 'image/gif'
        case '.avif': return 'image/avif'
        case '.heic': return 'image/heic'
        case '.heif': return 'image/heif'
        case '.mp4': return 'video/mp4'
        case '.mov': return 'video/quicktime'
        case '.webm': return 'audio/webm' // prefer audio for voice clips
        case '.m4v': return 'video/x-m4v'
        case '.mp3': return 'audio/mpeg'
        case '.wav': return 'audio/wav'
        case '.ogg': return 'audio/ogg'
        case '.oga': return 'audio/oga'
        case '.m4a': return 'audio/mp4'
        case '.aac': return 'audio/aac'
        default: return undefined
      }
    }

    function extFromMime(t: string): string | '' {
      const base = t.split(';')[0].toLowerCase()
      switch (base) {
        case 'image/png': return '.png'
        case 'image/jpeg': return '.jpg'
        case 'image/webp': return '.webp'
        case 'image/gif': return '.gif'
        case 'image/avif': return '.avif'
        case 'image/heic': return '.heic'
        case 'image/heif': return '.heif'
        case 'video/mp4': return '.mp4'
        case 'video/quicktime': return '.mov'
        case 'video/webm': return '.webm'
        case 'video/x-m4v': return '.m4v'
        case 'audio/mpeg': return '.mp3'
        case 'audio/wav': return '.wav'
        case 'audio/ogg': return '.ogg'
        case 'audio/oga': return '.oga'
        case 'audio/webm': return '.webm'
        case 'audio/mp4': return '.m4a'
        case 'audio/x-m4a': return '.m4a'
        case 'audio/aac': return '.aac'
        case 'audio/3gpp': return '.3gp'
        case 'audio/3gpp2': return '.3g2'
        default: return ''
      }
    }
    // Try converting an audio file to mp3 using ffmpeg, if available
    async function convertToMp3(inPath: string, outPath: string): Promise<void> {
      await new Promise<void>((resolve, reject) => {
        // ffmpeg -y -i input -codec:a libmp3lame -b:a 128k output
        execFile('ffmpeg', ['-y', '-i', inPath, '-codec:a', 'libmp3lame', '-b:a', '128k', outPath], (error) => {
          if (error) return reject(error)
          resolve()
        })
      })
    }

    for (const part of form) {
      if (!part.filename || !part.type || !part.data) continue
      if (part.data.length > maxSizeBytes) {
        setResponseStatus(event, 413)
        return createErrorResponse('File too large', 'FILE_TOO_LARGE')
      }
      let mimeType = String(part.type || '').split(';')[0]
      if (!mimeType || mimeType === 'application/octet-stream') {
        const guessed = mimeFromFilename(part.filename)
        if (guessed) mimeType = guessed
      }
      if (!allowedTypes.some((re) => re.test(mimeType))) {
        setResponseStatus(event, 415)
        return createErrorResponse('Unsupported media type', 'UNSUPPORTED_TYPE')
      }
      let ext = extname(part.filename) || ''
      if (!ext) {
        const fromMime = extFromMime(mimeType)
        if (fromMime) ext = fromMime
      }
      const fileName = `${randomUUID()}${ext}`
      const filePath = `${uploadDir}/${fileName}`
      await writeFile(filePath, part.data)

      // If audio but not already mp3, attempt to transcode to mp3
      const isAudio = /^audio\//i.test(mimeType)
      const datePrefix = new Date().toISOString().slice(0,10)
      if (isAudio && ext.toLowerCase() !== '.mp3') {
        const mp3Path = filePath.replace(/\.[^.]+$/i, '.mp3')
        const mp3Url = `/uploads/${datePrefix}/${fileName.replace(/\.[^.]+$/i, '.mp3')}`
        try {
          await convertToMp3(filePath, mp3Path)
          // Prefer returning mp3 URL; try removing original to save space (best-effort)
          try { await unlink(filePath) } catch { /* noop */ }
          urls.push(mp3Url)
  } catch {
          // ffmpeg missing or conversion failed; fall back to original
          const publicUrl = `/uploads/${datePrefix}/${fileName}`
          urls.push(publicUrl)
        }
      } else {
        const publicUrl = `/uploads/${datePrefix}/${fileName}`
        urls.push(publicUrl)
      }
    }

    return createSuccessResponse({ urls })
  } catch (error) {
    console.error('Upload error:', error)
    setResponseStatus(event, 500)
    return createErrorResponse('Failed to upload files', 'UPLOAD_ERROR')
  }
})

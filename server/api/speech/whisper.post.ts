import { requireAuth } from '../../utils/auth.middleware'
import { readMultipartFormData } from 'h3'

interface WhisperSegment {
  id?: number
  seek?: number
  start?: number
  end?: number
  text?: string
  tokens?: number[]
  temperature?: number
  avg_logprob?: number
  compression_ratio?: number
  no_speech_prob?: number
}
interface WhisperVerboseResponse {
  text?: string
  language?: string
  segments?: WhisperSegment[]
}

function sanitizeLanguage(input?: string | null): string | undefined {
  if (!input) return undefined
  const code = String(input).toLowerCase().split(/[-_]/)[0]
  return /^[a-z]{2}$/.test(code) ? code : undefined
}

export default defineEventHandler(async (event) => {
  // Require auth to use STT
  await requireAuth(event)

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Whisper not configured (missing OPENAI_API_KEY)' })
  }

  const parts = await readMultipartFormData(event)
  if (!parts || !Array.isArray(parts)) {
    throw createError({ statusCode: 400, statusMessage: 'Expected multipart/form-data with audio' })
  }

  const audio = parts.find(p => p.name === 'audio')
  if (!audio || !audio.data) {
    throw createError({ statusCode: 400, statusMessage: 'No audio provided' })
  }

  const langRaw = (parts.find(p => p.name === 'language')?.data?.toString('utf8')) || undefined
  const language = sanitizeLanguage(langRaw)
  const model = process.env.OPENAI_WHISPER_MODEL || 'whisper-1'

  // Build multipart form for OpenAI Whisper API
  const form = new FormData()
  const rawName = (typeof (audio as unknown as { filename?: string }).filename === 'string')
    ? ((audio as unknown as { filename?: string }).filename as string)
    : `audio-${Date.now()}.webm`
  const rawType = (typeof (audio as unknown as { type?: string }).type === 'string')
    ? ((audio as unknown as { type?: string }).type as string)
    : 'audio/webm'

  function normalizeType(t: string): { type: string; ext: string } {
    const base = t.split(';')[0].trim().toLowerCase()
    const allowed: Record<string, { type: string; ext: string }> = {
      'audio/webm': { type: 'audio/webm', ext: 'webm' },
      'video/webm': { type: 'audio/webm', ext: 'webm' }, // coerce to audio/webm
      'audio/ogg': { type: 'audio/ogg', ext: 'ogg' },
      'audio/oga': { type: 'audio/oga', ext: 'oga' },
      'audio/wav': { type: 'audio/wav', ext: 'wav' },
      'audio/mpeg': { type: 'audio/mpeg', ext: 'mp3' },
      'audio/mp3': { type: 'audio/mpeg', ext: 'mp3' },
      'audio/mp4': { type: 'audio/mp4', ext: 'm4a' },
      'audio/x-m4a': { type: 'audio/mp4', ext: 'm4a' },
      'audio/mpga': { type: 'audio/mpga', ext: 'mpga' },
      'audio/mpeg3': { type: 'audio/mpeg', ext: 'mp3' },
      'video/mp4': { type: 'video/mp4', ext: 'mp4' },
      'audio/flac': { type: 'audio/flac', ext: 'flac' },
      'application/octet-stream': { type: 'audio/webm', ext: 'webm' }
    }
    if (allowed[base]) return allowed[base]
    // default to audio/webm
    return { type: 'audio/webm', ext: 'webm' }
  }

  const { type: contentType, ext } = normalizeType(rawType)
  const finalName = rawName.endsWith(`.${ext}`) ? rawName : `${rawName.replace(/\.[^.]+$/, '')}.${ext}`
  const u8 = new Uint8Array(audio.data)
  const blob = new Blob([u8], { type: contentType })
  form.append('file', blob, finalName)
  form.append('model', model)
  // Let Whisper auto-detect language by default; only set if explicitly forced by client
  if (language) form.append('language', language)
  form.append('response_format', 'verbose_json')
  form.append('temperature', '0')
  // You can tweak temperature/prompt/etc here if desired

  const resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  })

  if (!resp.ok) {
    const errText = await resp.text().catch(() => 'Unknown error')
    throw createError({ statusCode: 502, statusMessage: `Whisper API error: ${errText}` })
  }

  const json = await resp.json() as WhisperVerboseResponse
  return { success: true, text: (json?.text || '').trim(), language: json?.language, segments: json?.segments }
})

type SpeechRecognitionEventLike = { resultIndex: number; results: Array<{ 0?: { transcript?: string }; isFinal?: boolean }> }
type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onstart: (() => void) | null
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}

export function useDictation() {
  const dictating = ref(false)
  const detectedLanguage = ref<string | null>(null)
  const interimTranscript = ref('')
  let recognition: SpeechRecognitionLike | null = null
  let restartTimer: number | null = null

  function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
    const w = window as unknown as Record<string, unknown>
    return (w['SpeechRecognition'] as unknown as (new () => SpeechRecognitionLike))
      || (w['webkitSpeechRecognition'] as unknown as (new () => SpeechRecognitionLike))
      || null
  }

  async function start(onText: (text: string) => void, onTyping?: () => void) {
    const SR = getSpeechRecognitionCtor()
    if (!SR) throw new Error('SpeechRecognition not supported')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(t => t.stop())
    } catch {
      throw new Error('Microphone permission is required')
    }

    interimTranscript.value = ''
  recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = navigator.language || 'en-US'
    let finalText = ''

  recognition.onstart = () => {
      dictating.value = true
      try {
    const langCode = (recognition!.lang || '').toLowerCase().split(/[-_]/)[0]
        detectedLanguage.value = (langCode ? langCode.toUpperCase() : null)
      } catch { detectedLanguage.value = null }
  }

  recognition.onresult = (ev: SpeechRecognitionEventLike) => {
      let interim = ''
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const item = ev.results?.[i]
        const seg = item?.[0]
        const transcript = (seg?.transcript || '')
        if (item?.isFinal) finalText += transcript + ' '
        else interim += transcript
      }
      interimTranscript.value = interim
      const next = (finalText + interim).trim()
      onText(next)
      onTyping?.()
    }

    recognition.onend = () => {
      if (dictating.value) {
        if (restartTimer) clearTimeout(restartTimer)
        restartTimer = window.setTimeout(() => {
          try { recognition?.start() } catch { /* ignore */ }
        }, 150)
      }
    }

    recognition.onerror = () => {
      dictating.value = false
      try { recognition?.stop() } catch { /* ignore */ }
    }

    try { recognition.start(); dictating.value = true } catch { /* ignore */ }
  }

  function stop() {
    dictating.value = false
  try { recognition?.stop() } catch { /* ignore */ }
    recognition = null
    interimTranscript.value = ''
    if (restartTimer) { clearTimeout(restartTimer); restartTimer = null }
    detectedLanguage.value = null
  }

  return { dictating, detectedLanguage, interimTranscript, start, stop }
}

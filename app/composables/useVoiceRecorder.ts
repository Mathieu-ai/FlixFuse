export function useVoiceRecorder() {
  const isRecording = ref(false)
  let mediaRecorder: MediaRecorder | null = null
  let mediaStream: MediaStream | null = null
  let chunks: Blob[] = []
  let startedAt = 0

  function getAudioMimeAndExt() {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/webm'
    ]
    for (const c of candidates) {
      const hasSupportCheck = 'isTypeSupported' in MediaRecorder && typeof (MediaRecorder as unknown as { isTypeSupported?: (t: string) => boolean }).isTypeSupported === 'function'
      const supported = hasSupportCheck ? ((MediaRecorder as unknown as { isTypeSupported: (t: string) => boolean }).isTypeSupported(c)) : true
      if (supported) {
        const base = (c || '').split(';')[0] || ''
        const ext = base.includes('ogg') ? 'ogg' : 'webm'
        return { mime: c, ext }
      }
    }
    return { mime: 'audio/webm', ext: 'webm' }
  }

  async function start() {
    if (isRecording.value) return
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const { mime } = getAudioMimeAndExt()
    chunks = []
    mediaRecorder = new MediaRecorder(mediaStream, { mimeType: mime } as MediaRecorderOptions)
    mediaRecorder.ondataavailable = (e: BlobEvent) => { if (e.data && e.data.size > 0) chunks.push(e.data) }
    startedAt = Date.now()
    isRecording.value = true
    mediaRecorder.start(250)
  }

  function stopStream() {
    try { mediaStream?.getTracks().forEach(t => t.stop()) } catch { /* ignore */ }
    mediaStream = null
  }

  async function stop(): Promise<File | null> {
    if (!isRecording.value) return null
    return await new Promise<File | null>((resolve) => {
      try {
        mediaRecorder!.onstop = () => {
          const duration = Date.now() - startedAt
          const blob = new Blob(chunks, { type: (chunks[0]?.type || 'audio/webm') })
          chunks = []
          stopStream()
          isRecording.value = false
          if (!blob || blob.size < 1024 || duration < 300) return resolve(null)
          const ext = blob.type.includes('ogg') ? 'ogg' : 'webm'
          const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: blob.type })
          resolve(file)
        }
        mediaRecorder?.stop()
      } catch {
        stopStream()
        isRecording.value = false
        resolve(null)
      } finally {
        mediaRecorder = null
      }
    })
  }

  function cancel() {
    try { mediaRecorder?.stop() } catch { /* ignore */ }
    chunks = []
    stopStream()
    isRecording.value = false
    mediaRecorder = null
  }

  return { isRecording, start, stop, cancel }
}

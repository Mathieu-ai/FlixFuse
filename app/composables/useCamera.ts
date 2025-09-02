export function useCamera() {
  const open = ref(false)
  const videoEl = ref<HTMLVideoElement | null>(null)
  let stream: MediaStream | null = null

  async function start() {
    try {
      stop()
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
    } catch {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      } catch {
        throw new Error('Unable to access camera. Please grant permission and try again.')
      }
    }
    try {
      if (videoEl.value && stream) {
        videoEl.value.srcObject = stream
        await videoEl.value.play().catch(() => {})
      }
    } catch { /* ignore */ }
  }

  function stop() {
    if (stream) {
      try { stream.getTracks().forEach(t => t.stop()) } catch { /* ignore */ }
      stream = null
    }
  }

  function attach(el: HTMLVideoElement | null) { videoEl.value = el }

  function capture(): File | null {
    if (!videoEl.value) return null
    const video = videoEl.value
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0)
    const blob = canvasToBlob(canvas)
    if (!blob) return null
    return new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
  }

  function canvasToBlob(canvas: HTMLCanvasElement): Blob | null {
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
      const arr = dataUrl.split(',')
      const header = arr[0] || ''
      const payload = arr[1] || ''
      const match = header.match(/:(.*?);/)
      const mime = (match && match[1]) ? match[1] : 'image/jpeg'
      const bstr = atob(payload)
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) u8arr[n] = bstr.charCodeAt(n)
      return new Blob([u8arr], { type: mime })
    } catch {
      return null
    }
  }

  onBeforeUnmount(() => stop())

  return { open, videoEl, start, stop, attach, capture }
}

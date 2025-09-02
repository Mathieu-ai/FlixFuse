<template>
  <div class="w-full max-w-lg">
    <div class="bg-gray-800 rounded-2xl p-4 flex items-center gap-4">
      <UButton 
        size="sm" 
        class="rounded-full w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-800" 
        @click="togglePlay" 
        :disabled="!hasAudio"
      >
        <UIcon :name="isPlaying ? 'i-heroicons-pause' : 'i-heroicons-play'" class="text-gray-800" />
      </UButton>

      <div class="flex-1 flex items-center gap-3">
        <!-- Current Time -->
        <span class="text-white text-sm font-medium min-w-[35px]">
          {{ formatTime(current) }}
        </span>

        <!-- Waveform Canvas -->
        <div class="flex-1 relative">
          <canvas 
            ref="canvas" 
            class="block w-full h-10 cursor-pointer" 
            @click="onSeekClick" 
            @mousedown="onMouseDown"
            @mousemove="onHover" 
            @mouseleave="onLeave"
            :style="{ cursor: isDragging ? 'grabbing' : 'pointer' }"
          ></canvas>
        </div>

        <!-- Duration -->
        <span class="text-white text-sm font-medium min-w-[35px]">
          {{ formatTime(duration) }}
        </span>
      </div>

      <!-- Avatar -->
  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <span class="text-white text-xs font-bold">A</span>
      </div>
    </div>

    <audio 
      ref="audio" 
      :src="src" 
      preload="metadata" 
      class="hidden" 
      @loadedmetadata="onLoaded" 
      @timeupdate="onTime" 
      @ended="onEnded"
      @play="onPlay"
      @pause="onPause"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue'

const props = defineProps<{ src: string }>()

const canvas = ref<HTMLCanvasElement | null>(null)
const audio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const hasAudio = ref(false)
const peaks = ref<number[]>([])
const duration = ref(0)
const current = ref(0)
const hoverX = ref<number | null>(null)
const isDragging = ref(false)

const rates = [1, 1.25, 1.5, 2]
const idx = ref(0)
const rateLabel = computed(() => `${rates[idx.value]}×`)

let ctx: CanvasRenderingContext2D | null = null
let raf: number | null = null

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function setupCanvas() {
  const cv = canvas.value
  if (!cv) return
  const dpr = window.devicePixelRatio || 1
  const rect = cv.getBoundingClientRect()
  const w = Math.max(200, rect.width)
  const h = 40
  cv.width = Math.floor(w * dpr)
  cv.height = Math.floor(h * dpr)
  cv.style.width = `${w}px`
  cv.style.height = `${h}px`
  ctx = cv.getContext('2d')
  if (ctx) ctx.scale(dpr, dpr)
}

function draw() {
  const cv = canvas.value
  if (!cv || !ctx) return
  const rect = cv.getBoundingClientRect()
  const w = rect.width
  const h = parseInt(cv.style.height || '40', 10)
  ctx.clearRect(0, 0, w, h)

  // Generate waveform bars
  const barW = 2
  const gap = 1
  const count = Math.max(80, Math.floor(w / (barW + gap)))
  const arr = peaks.value.length ? peaks.value : Array.from({ length: count }, () => 0.3 + Math.random() * 0.7)

  const progress = duration.value > 0 ? Math.min(1, current.value / duration.value) : 0
  const progressX = progress * w

  // Draw waveform bars
  for (let i = 0; i < count; i++) {
    const base = arr.length ? (arr[i % arr.length] ?? 0.3) : 0.3
    const barH = base * (h * 0.8)
    const x = i * (barW + gap)
    const y = (h - barH) / 2

    // Unplayed bars (gray)
    ctx.fillStyle = '#6B7280'
    ctx.fillRect(x, y, barW, barH)
    
    // Played bars (white) - only draw if this bar is before progress
    if (x < progressX) {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(x, y, barW, barH)
    }
  }

  // Draw blue progress dot
  const dotRadius = 8
  const dotY = h / 2

  // Dot shadow/glow
  ctx.beginPath()
  ctx.arc(progressX, dotY, dotRadius + 2, 0, 2 * Math.PI)
  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
  ctx.fill()

  // Main blue dot
  ctx.beginPath()
  ctx.arc(progressX, dotY, dotRadius, 0, 2 * Math.PI)
  ctx.fillStyle = '#3B82F6'
  ctx.fill()

  // White center highlight
  ctx.beginPath()
  ctx.arc(progressX, dotY, dotRadius - 3, 0, 2 * Math.PI)
  ctx.fillStyle = '#FFFFFF'
  ctx.fill()

  // Hover indicator
  if (hoverX.value !== null && !isDragging.value) {
    ctx.fillStyle = 'rgba(99,102,241,0.3)'
    ctx.fillRect(hoverX.value - 0.5, 0, 1, h)
  }
}

function loop() {
  draw()
  if (isPlaying.value) {
    raf = requestAnimationFrame(loop)
  }
}

function startAnimationLoop() {
  if (raf) return
  loop()
}

function stopAnimationLoop() {
  if (!raf) return
  cancelAnimationFrame(raf)
  raf = null
}

function fetchPeaks() {
  // Generate pseudo-random peaks for demo
  peaks.value = Array.from({ length: 120 }, () => 0.3 + Math.random() * 0.7)
}

function togglePlay() {
  if (!audio.value) return
  if (isPlaying.value) audio.value.pause()
  else audio.value.play().catch(() => {})
}

function onLoaded() {
  if (!audio.value) return
  duration.value = audio.value.duration || 0
  hasAudio.value = duration.value > 0
}

function onTime() {
  if (!audio.value || isDragging.value) return
  current.value = audio.value.currentTime || 0
}

function onEnded() {
  isPlaying.value = false
  current.value = 0
  stopAnimationLoop()
  draw()
}

function onPlay() {
  isPlaying.value = true
  startAnimationLoop()
}

function onPause() {
  isPlaying.value = false
  stopAnimationLoop()
  draw()
}

function onSeekClick(e: MouseEvent) {
  if (!audio.value || duration.value <= 0 || isDragging.value) return
  const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  
  // Check if click is near the blue dot (within 20px for easier interaction)
  const progress = duration.value > 0 ? current.value / duration.value : 0
  const progressX = progress * rect.width
  
  if (Math.abs(x - progressX) <= 20) {
    // Don't seek if clicking on the dot, let drag handle it
    return
  }
  
  // Seek to clicked position
  const ratio = Math.min(1, Math.max(0, x / rect.width))
  audio.value.currentTime = ratio * duration.value
  current.value = audio.value.currentTime
  draw()
}

function onMouseDown(e: MouseEvent) {
  if (!audio.value || duration.value <= 0) return
  const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  
  // Check if click is near the blue dot
  const progress = duration.value > 0 ? current.value / duration.value : 0
  const progressX = progress * rect.width
  
  if (Math.abs(x - progressX) <= 20) {
    isDragging.value = true
    e.preventDefault()
  }
}

function onMouseMove(e: MouseEvent) {
  if (isDragging.value && audio.value && duration.value > 0) {
    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const ratio = Math.min(1, Math.max(0, x / rect.width))
    const newTime = ratio * duration.value
    
    audio.value.currentTime = newTime
    current.value = newTime
    draw()
  }
}

function onMouseUp() {
  isDragging.value = false
}

function onHover(e: MouseEvent) {
  if (isDragging.value) {
    onMouseMove(e)
    return
  }
  
  const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
  hoverX.value = e.clientX - rect.left
}

function onLeave() {
  hoverX.value = null
}

function cycleSpeed() {
  idx.value = (idx.value + 1) % rates.length
  if (audio.value) audio.value.playbackRate = rates[idx.value] ?? 1
}

// Global mouse events for dragging
function handleGlobalMouseMove(e: MouseEvent) {
  if (!isDragging.value || !canvas.value || !audio.value || duration.value <= 0) return
  
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const ratio = Math.min(1, Math.max(0, x / rect.width))
  const newTime = ratio * duration.value
  
  audio.value.currentTime = newTime
  current.value = newTime
  draw()
}

function handleGlobalMouseUp() {
  isDragging.value = false
}

watch(() => props.src, async () => {
  await nextTick()
  setupCanvas()
  fetchPeaks()
  if (audio.value) audio.value.load()
})

onMounted(() => {
  setupCanvas()
  fetchPeaks()
  draw()

  // Add global mouse event listeners for dragging
  document.addEventListener('mousemove', handleGlobalMouseMove)
  document.addEventListener('mouseup', handleGlobalMouseUp)
})

onBeforeUnmount(() => {
  stopAnimationLoop()
  document.removeEventListener('mousemove', handleGlobalMouseMove)
  document.removeEventListener('mouseup', handleGlobalMouseUp)
})
</script>

<style scoped>
canvas { 
  image-rendering: -webkit-optimize-contrast; 
}
</style>
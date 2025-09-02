<template>
  <div class="flex items-center gap-3 select-none">
    <UButton :variant="mine ? 'soft' : 'ghost'" color="neutral" size="sm" class="shrink-0 rounded-full" @click="togglePlay" :title="playing ? 'Pause' : 'Play'" aria-label="Play/Pause">
      <UIcon :name="playing ? 'i-heroicons-pause' : 'i-heroicons-play'" />
    </UButton>

    <UCard variant="soft" color="neutral" class="shrink grow rounded-md p-1" @click.stop>
      <canvas ref="canvas" :width="width" :height="height" class="cursor-pointer w-full block" @click="onSeekClick" role="img" :aria-label="`Audio waveform for ${timeLabel}`" />
    </UCard>

    <span class="text-xs tabular-nums w-16 text-right font-mono">{{ timeLabel }}</span>

  <UButton variant="ghost" color="neutral" size="xs" class="shrink-0 rounded-full" @click="cycleSpeed" :title="`Speed ${playbackRate}x`" aria-label="Change playback speed">
      {{ playbackRate }}x
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'

const props = defineProps<{ src: string; mine?: boolean }>()

const mine = computed(() => !!props.mine)
const audio = new Audio()
audio.preload = 'metadata'
// slightly larger canvas for clearer waveform
const width = 220
const height = 36
const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let peaks: number[] = []
let raf: number | null = null
const playing = ref(false)
const duration = ref(0)
const currentTime = ref(0)
const playbackRate = ref(1)

const timeLabel = computed(() => {
  const t = Math.max(0, currentTime.value)
  const min = Math.floor(t / 60)
  const sec = Math.floor(t % 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
})

function draw() {
  if (!ctx || peaks.length === 0) return
  ctx.clearRect(0, 0, width, height)
  // center baseline
  ctx.globalAlpha = 1
  ctx.fillStyle = '#e2e8f0'
  ctx.fillRect(0, Math.floor(height / 2), width, 1)

  // Bars with active/inactive coloration for clear progress
  const barWidth = 3
  const gap = 1
  let x = 0
  const progressX = duration.value > 0 ? Math.min(width, Math.max(0, (currentTime.value / duration.value) * width)) : -1
  const baseBarColor = '#94a3b8' // visible neutral
  // Use a single subtle blue accent to avoid a strong green block that can obscure the UI
  const activeColor = '#2563eb'

  for (let i = 0; i < peaks.length && x < width; i++) {
    const v = peaks[i] ?? 0
    const h = Math.max(3, Math.round((v || 0) * (height - 8)))
    const y = Math.floor((height - h) / 2)
    const centerX = x + barWidth / 2
    // choose color depending on whether this bar is in the played region
    ctx.fillStyle = progressX >= 0 && centerX <= progressX ? activeColor : baseBarColor
    ctx.globalAlpha = 1
    ctx.fillRect(x, y, barWidth, h)
    x += barWidth + gap
  }

  // subtle overlay glow on progress edge
  if (progressX > 0) {
    ctx.fillStyle = activeColor
    ctx.globalAlpha = 0.06
    ctx.fillRect(0, 0, progressX, height)
    ctx.globalAlpha = 1
  }
}

function loop() {
  currentTime.value = audio.currentTime
  draw()
  raf = requestAnimationFrame(loop)
}

function togglePlay() {
  if (playing.value) {
    audio.pause()
  } else {
    audio.play().catch(() => {})
  }
}

function cycleSpeed() {
  const next = playbackRate.value === 1 ? 1.5 : (playbackRate.value === 1.5 ? 2 : 1)
  playbackRate.value = next
  audio.playbackRate = next
}

function onSeekClick(e: MouseEvent) {
  if (duration.value <= 0 || !canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const ratio = Math.min(1, Math.max(0, x / rect.width))
  audio.currentTime = ratio * duration.value
}

async function buildPeaks() {
  try {
    const res = await fetch(props.src)
    const buf = await res.arrayBuffer()
    const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext
    const ac = new AC()
    const audioBuf = await ac.decodeAudioData(buf)
    const raw = audioBuf.getChannelData(0)
    const samplesPerBar = Math.max(200, Math.floor(raw.length / (width / 3)))
    const out: number[] = []
    for (let i = 0; i < raw.length; i += samplesPerBar) {
      let sum = 0
      let count = 0
      for (let j = i; j < Math.min(i + samplesPerBar, raw.length); j++) {
        const v = raw[j]
        sum += Math.abs(v)
        count++
      }
      out.push(Math.min(1, (sum / (count || 1)) * 3))
    }
    peaks = out
    draw()
  } catch {
    // ignore waveform failures
  }
}

onMounted(async () => {
  if (canvas.value) ctx = canvas.value.getContext('2d')
  audio.src = props.src
  audio.addEventListener('loadedmetadata', () => {
    duration.value = isFinite(audio.duration) ? audio.duration : 0
    draw()
  })
  audio.addEventListener('play', () => {
    playing.value = true
    raf = requestAnimationFrame(loop)
  })
  audio.addEventListener('pause', () => {
    playing.value = false
    if (raf) { cancelAnimationFrame(raf); raf = null }
    draw()
  })
  audio.addEventListener('ended', () => {
    playing.value = false
    currentTime.value = duration.value
    if (raf) { cancelAnimationFrame(raf); raf = null }
    draw()
  })
  await buildPeaks()
})

onBeforeUnmount(() => {
  try { audio.pause() } catch {}
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
canvas {
  width: 100%;
  height: 36px; /* mirrors the script height */
  display: block;
}
</style>

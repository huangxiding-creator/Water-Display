<script setup lang="ts">
/**
 * Hero simulator ② — 洪水淹没预演 (Flood inundation rehearsal).
 * Owner picks a storm frequency (5/10/20/50-year), presses play, and watches
 * a 7-day water-level + inundation animation unfold across West/Middle/East
 * main canals downstream of Jiangxiang Reservoir. Risk heatmap + arrival time.
 */
import { ref, computed, onBeforeUnmount } from 'vue'
import EChart from '@/components/EChart.vue'
import { AXIS_STYLE, TOOLTIP_STYLE } from '@/composables/echarts'

type Freq = 5 | 10 | 20 | 50
const freq = ref<Freq>(20)
const playing = ref(false)
const day = ref(0)
let timer: number | undefined

const freqMeta: Record<Freq, { label: string; peak: number; color: string }> = {
  5: { label: '5年一遇', peak: 38, color: '#52C41A' },
  10: { label: '10年一遇', peak: 42, color: '#00D4FF' },
  20: { label: '20年一遇', peak: 46, color: '#FAAD14' },
  50: { label: '50年一遇', peak: 52, color: '#FF4D4F' },
}

const canals = ['西干渠', '中干渠', '东干渠']

function levelAt(canalIdx: number, d: number): number {
  const peak = freqMeta[freq.value].peak
  const base = 28 + canalIdx * 2
  // Bell curve peaking around day 3-4, canal-dependent lag
  const center = 3 + canalIdx * 0.5
  const v = base + (peak - base) * Math.exp(-Math.pow(d - center, 2) / 3)
  return Math.round(v * 10) / 10
}

const days = Array.from({ length: 8 }, (_, i) => i) // day 0..7
const levelOption = computed(() => ({
  tooltip: { ...TOOLTIP_STYLE, trigger: 'axis' },
  legend: { data: canals, textStyle: { color: '#7FA8D0', fontSize: 11 }, top: 0 },
  grid: { top: 36, right: 20, bottom: 40, left: 50 },
  xAxis: { type: 'category', data: days.map((d) => `第${d}天`), ...AXIS_STYLE },
  yAxis: { type: 'value', name: '水位(m)', min: 25, max: 56, ...AXIS_STYLE },
  series: canals.map((c, i) => {
    const warningLine = 40
    const data = days.map((d) => levelAt(i, d))
    return {
      name: c,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data,
      markLine: i === 0 ? { silent: true, lineStyle: { color: '#FF4D4F', type: 'dashed' }, data: [{ yAxis: warningLine, name: '警戒水位' }] } : {},
      lineStyle: { width: 2 },
      itemStyle: { color: ['#00D4FF', '#FFB100', '#B37FEB'][i] },
      areaStyle: day.value > 0 && i === 0 ? { color: 'rgba(0,212,255,0.08)' } : undefined,
    }
  }),
}))

// Inundation heatmap (canal × day) — current state up to `day`
const heatOption = computed(() => ({
  tooltip: { ...TOOLTIP_STYLE },
  grid: { top: 20, right: 20, bottom: 50, left: 60 },
  xAxis: { type: 'category', data: days.map((d) => `D${d}`), ...AXIS_STYLE, splitArea: { show: true } },
  yAxis: { type: 'category', data: ['西干渠', '中干渠', '东干渠'], ...AXIS_STYLE, splitArea: { show: true } },
  visualMap: {
    min: 0, max: 4, calculable: true, orient: 'horizontal', left: 'center', bottom: 0,
    textStyle: { color: '#7FA8D0' },
    inRange: { color: ['#0B2247', '#0066FF', '#00D4FF', '#FAAD14', '#FF4D4F'] },
  },
  series: [
    {
      type: 'heatmap',
      data: canals.flatMap((_, ci) => days.map((d) => [d, ci, d <= day.value ? Math.min(4, Math.max(0, Math.round((levelAt(ci, d) - 30) / 5))) : 0])),
      label: { show: false },
      emphasis: { itemStyle: { shadowBlur: 10 } },
    },
  ],
}))

const peakLevel = computed(() => Math.max(...canals.map((_, i) => levelAt(i, day.value))))
const risk = computed(() => {
  if (peakLevel.value >= 48) return { label: '严重风险', color: 'var(--wd-danger)', inund: '~12.4 km²', arrive: '第2.5天' }
  if (peakLevel.value >= 42) return { label: '中度风险', color: 'var(--wd-warning)', inund: '~6.8 km²', arrive: '第3天' }
  if (peakLevel.value >= 38) return { label: '低风险', color: 'var(--wd-primary)', inund: '~2.1 km²', arrive: '第3.5天' }
  return { label: '安全', color: 'var(--wd-success)', inund: '0 km²', arrive: '—' }
})

function play() {
  if (playing.value) {
    pause()
    return
  }
  playing.value = true
  if (day.value >= 7) day.value = 0
  timer = window.setInterval(() => {
    day.value += 1
    if (day.value >= 7) pause()
  }, 600)
}
function pause() {
  playing.value = false
  if (timer) window.clearInterval(timer)
}
function reset() {
  pause()
  day.value = 0
}
onBeforeUnmount(pause)
</script>

<template>
  <div class="sim">
    <div class="sim__bar">
      <div class="sim__control">
        <span class="sim__label">暴雨频率</span>
        <div class="sim__years">
          <button
            v-for="(m, k) in freqMeta"
            :key="k"
            class="sim__year"
            :class="{ 'sim__year--active': freq === Number(k) }"
            :style="freq === Number(k) ? { borderColor: m.color, color: m.color } : {}"
            @click="reset(); freq = Number(k) as Freq"
          >
            {{ m.label }}
          </button>
        </div>
      </div>
      <div class="sim__play">
        <button class="sim__play-btn" @click="play">{{ playing ? '⏸ 暂停' : '▶ 播放预演' }}</button>
        <button class="sim__step" :disabled="day >= 7" @click="day++">单步 →</button>
        <button class="sim__reset" @click="reset">重置</button>
      </div>
      <div class="sim__stats">
        <div class="sim__stat"><span class="sim__stat-num">D{{ day }}</span><span class="sim__stat-unit">当前时刻</span></div>
        <div class="sim__stat"><span class="sim__stat-num">{{ peakLevel }}</span><span class="sim__stat-unit">m 峰值水位</span></div>
        <div class="sim__stat" :style="{ borderColor: risk.color }">
          <span class="sim__stat-num" :style="{ color: risk.color }">{{ risk.label }}</span>
          <span class="sim__stat-unit">风险研判</span>
        </div>
        <div class="sim__stat"><span class="sim__stat-num">{{ risk.inund }}</span><span class="sim__stat-unit">淹没范围</span></div>
        <div class="sim__stat"><span class="sim__stat-num">{{ risk.arrive }}</span><span class="sim__stat-unit">洪水到达</span></div>
      </div>
    </div>

    <div class="sim__grid sim__grid--2">
      <div class="sim__panel">
        <div class="sim__panel-title">干渠水位过程线（7天滚动 · 警戒水位 40m）</div>
        <EChart :option="levelOption" height="280px" />
      </div>
      <div class="sim__panel">
        <div class="sim__panel-title">淹没风险热力图（干渠 × 时间）</div>
        <EChart :option="heatOption" height="280px" />
      </div>
    </div>

    <p class="sim__note">注：基于区间回水计算模型的演示数据，对应报告 15.5.3.3。真实预演需接入防洪调度模型。</p>
  </div>
</template>

<style scoped>
@import './_sim.css';
.sim__grid--2 {
  grid-template-columns: 1fr 1fr;
}
@media (max-width: 1100px) {
  .sim__grid--2 { grid-template-columns: 1fr; }
}
</style>

<script setup lang="ts">
/**
 * Interactive performance-requirement dashboard (15.3.4).
 * Turns the static performance table into tangible gauges + stat tiles,
 * so owners can *feel* the SLA the platform must meet.
 */
import { computed } from 'vue'
import EChart from './EChart.vue'
import { project } from '@/data/project'

const concurrent = project.performance.concurrentUsers ?? 200
const responseSec = project.performance.responseTimeSec ?? 3
const videoDays = project.performance.videoRetentionDays ?? 30

const gaugeOption = computed(() => ({
  series: [
    {
      type: 'gauge', center: ['28%', '55%'], radius: '70%', min: 0, max: 400, startAngle: 200, endAngle: -20,
      progress: { show: true, width: 12, itemStyle: { color: '#00D4FF' } },
      axisLine: { lineStyle: { width: 12, color: [[concurrent / 400, '#00D4FF'], [1, 'rgba(127,168,208,0.12)']] } },
      pointer: { itemStyle: { color: '#E6F2FF' }, length: '60%' },
      axisTick: { show: false }, splitLine: { distance: -18, lineStyle: { color: 'rgba(127,168,208,0.3)' } },
      axisLabel: { color: '#7FA8D0', fontSize: 9, distance: -28 },
      detail: { valueAnimation: true, color: '#E6F2FF', fontSize: 18, fontFamily: 'JetBrains Mono', offsetCenter: [0, '32%'], formatter: `{value} 人` },
      title: { color: '#7FA8D0', fontSize: 11, offsetCenter: [0, '58%'] },
      data: [{ value: concurrent, name: '并发在线' }],
    },
    {
      type: 'gauge', center: ['72%', '55%'], radius: '70%', min: 0, max: 10, startAngle: 200, endAngle: -20,
      progress: { show: true, width: 12, itemStyle: { color: '#52C41A' } },
      axisLine: { lineStyle: { width: 12, color: [[responseSec / 10, '#52C41A'], [0.8, '#FFB100'], [1, '#FF4D4F']] } },
      pointer: { itemStyle: { color: '#E6F2FF' }, length: '60%' },
      axisTick: { show: false }, splitLine: { distance: -18, lineStyle: { color: 'rgba(127,168,208,0.3)' } },
      axisLabel: { color: '#7FA8D0', fontSize: 9, distance: -28 },
      detail: { valueAnimation: true, color: '#E6F2FF', fontSize: 18, fontFamily: 'JetBrains Mono', offsetCenter: [0, '32%'], formatter: `≤{value}s` },
      title: { color: '#7FA8D0', fontSize: 11, offsetCenter: [0, '58%'] },
      data: [{ value: responseSec, name: '一般查询响应' }],
    },
  ],
}))

const tiles = [
  { label: '骨干/核心带宽', value: '10G', sub: '万兆' },
  { label: '接入层', value: '1G', sub: '千兆到桌面' },
  { label: '视频分辨率', value: project.performance.videoResolution?.split('/')[0]?.trim() ?? '1080P', sub: '≥400万像素' },
  { label: '视频存储', value: `${videoDays}天`, sub: '前端存储' },
  { label: '复杂查询', value: '<8s', sub: '复杂汇总≤10min' },
  { label: '供电可用性', value: project.performance.availability?.replace('交流供电稳定性 ', '') ?? '99%', sub: '太阳能续航15天' },
]
</script>

<template>
  <div class="pd">
    <EChart :option="gaugeOption" height="200px" />
    <div class="pd__tiles">
      <div v-for="t in tiles" :key="t.label" class="pd__tile">
        <span class="pd__tile-val">{{ t.value }}</span>
        <span class="pd__tile-label">{{ t.label }}</span>
        <span class="pd__tile-sub">{{ t.sub }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pd { display: flex; flex-direction: column; gap: 14px; }
.pd__tiles { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
@media (max-width: 1100px) { .pd__tiles { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 600px) { .pd__tiles { grid-template-columns: repeat(2, 1fr); } }
.pd__tile { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 12px 8px; background: rgba(0,212,255,0.04); border: 1px solid rgba(0,212,255,0.15); border-radius: 8px; text-align: center; }
.pd__tile-val { font-family: var(--wd-font-mono); font-size: 18px; font-weight: 700; color: var(--wd-accent); }
.pd__tile-label { font-size: 11px; color: var(--wd-text); }
.pd__tile-sub { font-size: 10px; color: var(--wd-text-dim); }
</style>

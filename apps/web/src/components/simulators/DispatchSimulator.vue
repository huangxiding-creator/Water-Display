<script setup lang="ts">
/**
 * Hero simulator ① — 四预调度演练 (Water-resource allocation & dispatch).
 * Owner picks a typical year (wet/normal/dry/extremely-dry), watches the
 * supply-demand balance shift, adjusts the allocation weights per zone, and
 * sees the resulting water-level process line + guarantee rate + energy update.
 * All mock data, no real system — purpose is requirement communication.
 */
import { ref, computed } from 'vue'
import EChart from '@/components/EChart.vue'
import { CHART_PALETTE, AXIS_STYLE, TOOLTIP_STYLE } from '@/composables/echarts'

const props = defineProps<{ chapterId?: string; chapterTitle?: string }>()

type Year = 'wet' | 'normal' | 'dry' | 'extremely-dry'
const year = ref<Year>('normal')
const yearMeta: Record<Year, { label: string; factor: number; color: string }> = {
  wet: { label: '丰水年 P=25%', factor: 1.25, color: '#52C41A' },
  normal: { label: '平水年 P=50%', factor: 1.0, color: '#00D4FF' },
  dry: { label: '枯水年 P=75%', factor: 0.75, color: '#FAAD14' },
  'extremely-dry': { label: '特枯年 P=95%', factor: 0.5, color: '#FF4D4F' },
}

// Allocation weights per zone (owner-adjustable)
const zones = ref([
  { name: '直供片', weight: 35, demand: 35 },
  { name: '联合灌片', weight: 28, demand: 30 },
  { name: '余庄片', weight: 18, demand: 18 },
  { name: '八龙片', weight: 12, demand: 14 },
  { name: '城乡供水', weight: 7, demand: 8 },
])
const totalWeight = computed(() => zones.value.reduce((s, z) => s + z.weight, 0))

// Derived metrics from year factor + weights
const availableWater = computed(() => Math.round(4200 * yearMeta[year.value].factor))
const allocatedTotal = computed(() => Math.round((availableWater.value * totalWeight.value) / 100))
const guarantee = computed(() => {
  const satisfied = zones.value.filter((z) => z.weight >= z.demand * 0.8).length
  return Math.round((satisfied / zones.value.length) * 100)
})
const energy = computed(() => Math.round(allocatedTotal.value * 0.85))
const warning = computed(() => {
  if (guarantee.value >= 90) return { level: '正常', color: 'var(--wd-success)' }
  if (guarantee.value >= 70) return { level: '黄色预警', color: 'var(--wd-warning)' }
  return { level: '红色预警', color: 'var(--wd-danger)' }
})

// Water-level process line over 12 months
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const levelOption = computed(() => ({
  tooltip: { ...TOOLTIP_STYLE, trigger: 'axis' },
  legend: { data: ['可供水量', '实际配水', '需水量'], textStyle: { color: '#7FA8D0', fontSize: 11 }, top: 0 },
  grid: { top: 36, right: 20, bottom: 30, left: 50 },
  xAxis: { type: 'category', data: months, ...AXIS_STYLE },
  yAxis: { type: 'value', name: '万m³', ...AXIS_STYLE },
  series: [
    {
      name: '可供水量', type: 'line', smooth: true, symbol: 'none',
      data: months.map((_, i) => Math.round(availableWater.value / 12 * (1 + 0.3 * Math.sin((i / 12) * Math.PI * 2)))),
      lineStyle: { color: CHART_PALETTE[0], width: 2 }, areaStyle: { color: 'rgba(0,212,255,0.1)' },
    },
    {
      name: '实际配水', type: 'line', smooth: true, symbol: 'none',
      data: months.map((_, i) => Math.round(allocatedTotal.value / 12 * (1 + 0.4 * Math.sin((i / 12) * Math.PI * 2 - 0.5)))),
      lineStyle: { color: CHART_PALETTE[1], width: 2 },
    },
    {
      name: '需水量', type: 'line', smooth: true, symbol: 'none',
      data: months.map((_, i) => Math.round(360 * (1 + 0.5 * Math.sin((i / 12) * Math.PI * 2 - 1)))),
      lineStyle: { color: CHART_PALETTE[2], width: 2, type: 'dashed' },
    },
  ],
}))

const zoneOption = computed(() => ({
  tooltip: { ...TOOLTIP_STYLE, trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['配水权重', '需水权重'], textStyle: { color: '#7FA8D0', fontSize: 11 }, top: 0 },
  grid: { top: 36, right: 20, bottom: 30, left: 80 },
  xAxis: { type: 'value', ...AXIS_STYLE },
  yAxis: { type: 'category', data: zones.value.map((z) => z.name), ...AXIS_STYLE },
  series: [
    { name: '配水权重', type: 'bar', data: zones.value.map((z) => z.weight), itemStyle: { color: CHART_PALETTE[0], borderRadius: [0, 4, 4, 0] }, barWidth: '30%' },
    { name: '需水权重', type: 'bar', data: zones.value.map((z) => z.demand), itemStyle: { color: CHART_PALETTE[2], borderRadius: [0, 4, 4, 0] }, barWidth: '30%' },
  ],
}))

function reset() {
  zones.value = zones.value.map((z, i) => ({ ...z, weight: [35, 28, 18, 12, 7][i] }))
}
</script>

<template>
  <div class="sim">
    <!-- control bar -->
    <div class="sim__bar">
      <div class="sim__control">
        <span class="sim__label">典型年情景</span>
        <div class="sim__years">
          <button
            v-for="(m, k) in yearMeta"
            :key="k"
            class="sim__year"
            :class="{ 'sim__year--active': year === k }"
            :style="year === k ? { borderColor: m.color, color: m.color } : {}"
            @click="year = k"
          >
            {{ m.label }}
          </button>
        </div>
      </div>
      <div class="sim__stats">
        <div class="sim__stat"><span class="sim__stat-num">{{ availableWater }}</span><span class="sim__stat-unit">万m³ 可供</span></div>
        <div class="sim__stat"><span class="sim__stat-num">{{ guarantee }}%</span><span class="sim__stat-unit">保证率</span></div>
        <div class="sim__stat"><span class="sim__stat-num">{{ energy }}</span><span class="sim__stat-unit">kWh 能耗</span></div>
        <div class="sim__stat" :style="{ borderColor: warning.color }">
          <span class="sim__stat-num" :style="{ color: warning.color }">{{ warning.level }}</span>
          <span class="sim__stat-unit">智能研判</span>
        </div>
      </div>
    </div>

    <div class="sim__grid">
      <div class="sim__panel">
        <div class="sim__panel-title">分区配水权重（拖动调节）</div>
        <div class="sim__zones">
          <div v-for="z in zones" :key="z.name" class="sim__zone">
            <div class="sim__zone-head">
              <span>{{ z.name }}</span>
              <span class="sim__zone-val" :class="{ 'is-low': z.weight < z.demand * 0.8 }">
                {{ z.weight }}% / 需 {{ z.demand }}%
              </span>
            </div>
            <input v-model.number="z.weight" type="range" min="0" max="60" step="1" class="sim__slider" :aria-label="`${z.name}配水权重`" />
          </div>
        </div>
        <button class="sim__reset" @click="reset">重置默认</button>
      </div>

      <div class="sim__panel">
        <div class="sim__panel-title">供需水过程线（12月）</div>
        <EChart :option="levelOption" height="240px" />
      </div>

      <div class="sim__panel">
        <div class="sim__panel-title">分区配水 vs 需水</div>
        <EChart :option="zoneOption" height="240px" />
      </div>
    </div>

    <p class="sim__note">注：以上为基于配置参数动态计算的演示数据，对应报告 {{ props.chapterTitle }} (15.5.3.2)。真实调度需接入水动力学/配置模型。</p>
  </div>
</template>

<style scoped>
.sim {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sim__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 14px 16px;
  background: rgba(0, 212, 255, 0.04);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 10px;
}
.sim__control {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sim__label {
  font-size: 12px;
  color: var(--wd-text-dim);
}
.sim__years {
  display: flex;
  gap: 6px;
}
.sim__year {
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 6px;
  background: rgba(6, 21, 40, 0.5);
  color: var(--wd-text-dim);
  transition: all 0.18s;
}
.sim__year--active {
  background: rgba(0, 212, 255, 0.1);
}
.sim__stats {
  display: flex;
  gap: 12px;
}
.sim__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 8px;
  min-width: 90px;
}
.sim__stat-num {
  font-size: 20px;
  font-weight: 700;
  font-family: var(--wd-font-mono);
  color: var(--wd-primary);
}
.sim__stat-unit {
  font-size: 11px;
  color: var(--wd-text-dim);
  margin-top: 2px;
}
.sim__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
@media (max-width: 1100px) {
  .sim__grid { grid-template-columns: 1fr; }
}
.sim__panel {
  padding: 14px;
  background: rgba(6, 21, 40, 0.4);
  border: 1px solid rgba(127, 168, 208, 0.12);
  border-radius: 8px;
}
.sim__panel-title {
  font-size: 12px;
  color: var(--wd-primary);
  margin-bottom: 12px;
  font-weight: 600;
}
.sim__zones {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sim__zone-head {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--wd-text);
  margin-bottom: 6px;
}
.sim__zone-val.is-low {
  color: var(--wd-danger);
}
.sim__slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(127, 168, 208, 0.2);
  border-radius: 2px;
  outline: none;
}
.sim__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--wd-primary);
  cursor: pointer;
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
}
.sim__reset {
  margin-top: 12px;
  padding: 5px 12px;
  font-size: 11px;
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 5px;
  background: none;
  color: var(--wd-text-dim);
}
.sim__reset:hover {
  color: var(--wd-primary);
  border-color: var(--wd-primary);
}
.sim__note {
  margin: 0;
  font-size: 11px;
  color: var(--wd-text-dim);
  opacity: 0.7;
  line-height: 1.6;
}
</style>

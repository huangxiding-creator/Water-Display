<script setup lang="ts">
/**
 * Interactive per-module mock dashboards.
 * Every business module gets visuals AND operable controls (switch station /
 * year / period) so charts respond — every module is "可玩", not just the 3
 * hero simulators. Pure mock data; purpose is intuitive requirement demo.
 */
import { ref, computed } from 'vue'
import EChart from './EChart.vue'
import Panel from './Panel.vue'
import { AXIS_STYLE, TOOLTIP_STYLE } from '@/composables/echarts'

const props = defineProps<{ moduleId: string }>()

const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

/* ====================== biz-forecast (interactive) ====================== */
const forecastStation = ref('jiangxiang')
const forecastStations = [
  { id: 'jiangxiang', name: '江巷水库' },
  { id: 'caiqiao', name: '蔡桥水库' },
  { id: 'chuhe1', name: '滁河一级站' },
]
// each station has its own mock series
const forecastSeries: Record<string, { level: number[]; rain: number[]; soil: number[] }> = {
  jiangxiang: { level: [28, 27, 29, 31, 33, 36, 38, 37, 34, 31, 29, 28], rain: [20, 30, 50, 80, 110, 160, 200, 180, 90, 60, 40, 25], soil: [40, 38, 42, 48, 55, 62, 68, 65, 55, 48, 44, 41] },
  caiqiao: { level: [30, 29, 31, 33, 35, 37, 39, 38, 35, 32, 30, 29], rain: [18, 28, 46, 75, 105, 155, 195, 175, 88, 58, 38, 23], soil: [42, 40, 44, 50, 57, 64, 70, 67, 57, 50, 46, 43] },
  chuhe1: { level: [22, 21, 23, 25, 27, 30, 33, 32, 28, 25, 23, 22], rain: [25, 35, 55, 85, 115, 165, 210, 190, 95, 65, 45, 28], soil: [38, 36, 40, 46, 53, 60, 66, 63, 53, 46, 42, 39] },
}
const forecastConditionOption = computed(() => {
  const s = forecastSeries[forecastStation.value]
  return {
    tooltip: { ...TOOLTIP_STYLE, trigger: 'axis' },
    legend: { data: ['水位(m)', '雨量(mm)', '墒情(%)'], textStyle: { color: '#7FA8D0', fontSize: 11 }, top: 0 },
    grid: { top: 36, right: 24, bottom: 28, left: 44 },
    xAxis: { type: 'category', data: months, ...AXIS_STYLE },
    yAxis: { type: 'value', ...AXIS_STYLE },
    series: [
      { name: '水位(m)', type: 'line', smooth: true, data: s.level, lineStyle: { color: '#00D4FF', width: 2 }, itemStyle: { color: '#00D4FF' } },
      { name: '雨量(mm)', type: 'bar', data: s.rain, itemStyle: { color: 'rgba(0,102,255,0.5)' }, barWidth: '40%' },
      { name: '墒情(%)', type: 'line', smooth: true, data: s.soil, lineStyle: { color: '#52C41A', width: 2, type: 'dashed' }, itemStyle: { color: '#52C41A' } },
    ],
  }
})
const forecastDemandOption = {
  tooltip: { ...TOOLTIP_STYLE, trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['农业灌溉', '城乡供水', '生态补水'], textStyle: { color: '#7FA8D0', fontSize: 11 }, top: 0 },
  grid: { top: 36, right: 24, bottom: 28, left: 44 },
  xAxis: { type: 'category', data: ['直供片', '联合灌片', '余庄片', '八龙片'], ...AXIS_STYLE },
  yAxis: { type: 'value', name: '万m³', ...AXIS_STYLE },
  series: [
    { name: '农业灌溉', type: 'bar', stack: 'a', data: [1200, 980, 420, 360], itemStyle: { color: '#00D4FF' }, barWidth: '45%' },
    { name: '城乡供水', type: 'bar', stack: 'a', data: [180, 240, 90, 60], itemStyle: { color: '#FFB100' } },
    { name: '生态补水', type: 'bar', stack: 'a', data: [90, 110, 40, 30], itemStyle: { color: '#52C41A' } },
  ],
}

/* ======================= biz-supply (interactive) ======================= */
const supplyYear = ref<'wet' | 'normal' | 'dry'>('normal')
const supplyYearMeta = {
  wet: { label: '丰水年', factor: 1.2, color: '#52C41A' },
  normal: { label: '平水年', factor: 1.0, color: '#00D4FF' },
  dry: { label: '枯水年', factor: 0.7, color: '#FF4D4F' },
}
const supplyBase = { plan: [800, 900, 1200, 1500, 1800, 2100, 2300, 2200, 1700, 1300, 1000, 850], loss: [40, 30, 50, 60, 80, 90, 90, 100, 70, 50, 40, 30] }
const supplyVolumeOption = computed(() => {
  const f = supplyYearMeta[supplyYear.value].factor
  return {
    tooltip: { ...TOOLTIP_STYLE, trigger: 'axis' },
    legend: { data: ['计划供水', '实际供水', '渠道损耗'], textStyle: { color: '#7FA8D0', fontSize: 11 }, top: 0 },
    grid: { top: 36, right: 24, bottom: 28, left: 44 },
    xAxis: { type: 'category', data: months, ...AXIS_STYLE },
    yAxis: { type: 'value', name: '万m³', ...AXIS_STYLE },
    series: [
      { name: '计划供水', type: 'line', smooth: true, data: supplyBase.plan.map((v) => Math.round(v * f)), lineStyle: { color: '#FFB100', width: 2, type: 'dashed' }, itemStyle: { color: '#FFB100' } },
      { name: '实际供水', type: 'bar', data: supplyBase.plan.map((v) => Math.round(v * f * 0.94)), itemStyle: { color: '#00D4FF', borderRadius: [4, 4, 0, 0] }, barWidth: '40%' },
      { name: '渠道损耗', type: 'line', smooth: true, data: supplyBase.loss.map((v) => Math.round(v * f)), lineStyle: { color: '#FF4D4F', width: 2 }, itemStyle: { color: '#FF4D4F' } },
    ],
  }
})
const supplyFeeOption = computed(() => {
  const f = supplyYearMeta[supplyYear.value].factor
  return {
    tooltip: { ...TOOLTIP_STYLE, trigger: 'axis' },
    legend: { data: ['水费收入(万元)', '调水成本(万元)'], textStyle: { color: '#7FA8D0', fontSize: 11 }, top: 0 },
    grid: { top: 36, right: 24, bottom: 28, left: 48 },
    xAxis: { type: 'category', data: ['直供片', '联合灌片', '余庄片', '八龙片', '城乡'], ...AXIS_STYLE },
    yAxis: { type: 'value', ...AXIS_STYLE },
    series: [
      { name: '水费收入(万元)', type: 'bar', data: [320, 280, 120, 95, 180].map((v) => Math.round(v * f)), itemStyle: { color: '#52C41A', borderRadius: [4, 4, 0, 0] }, barWidth: '30%' },
      { name: '调水成本(万元)', type: 'bar', data: [240, 210, 95, 75, 140].map((v) => Math.round(v * f)), itemStyle: { color: '#FF4D4F', borderRadius: [4, 4, 0, 0] }, barWidth: '30%' },
    ],
  }
})

/* ===================== biz-engineering (interactive) ==================== */
const engStation = ref('guoji1')
const engStations = [
  { id: 'guoji1', name: '郭集一级站', score: 92, level3: '基本正常', color: '#52C41A' },
  { id: 'wuwei1', name: '吴圩一级站', score: 88, level3: '基本正常', color: '#52C41A' },
  { id: 'lianjiang', name: '连江站', score: 72, level3: '局部异常', color: '#FFB100' },
  { id: 'sanguan', name: '三官站', score: 95, level3: '正常', color: '#52C41A' },
  { id: 'dong1chuhe', name: '滁河一级站', score: 58, level3: '局部异常', color: '#FFB100' },
]
const engCurrent = computed(() => engStations.find((s) => s.id === engStation.value)!)
const engGaugeOption = computed(() => ({
  series: [
    {
      type: 'gauge', center: ['50%', '60%'], radius: '90%', min: 0, max: 100,
      progress: { show: true, width: 14, itemStyle: { color: engCurrent.value.color } },
      axisLine: { lineStyle: { width: 14, color: [[0.6, '#FF4D4F'], [0.85, '#FFB100'], [1, '#52C41A']] } },
      axisTick: { show: false }, splitLine: { lineStyle: { color: 'rgba(127,168,208,0.3)' } },
      axisLabel: { color: '#7FA8D0', fontSize: 10, distance: 20 },
      pointer: { itemStyle: { color: '#E6F2FF' } },
      detail: { valueAnimation: true, color: '#E6F2FF', fontSize: 22, fontFamily: 'JetBrains Mono', offsetCenter: [0, '35%'], formatter: '{value} 分' },
      title: { show: false },
      data: [{ value: engCurrent.value.score }],
    },
  ],
}))
const engMonitorOption = {
  tooltip: { ...TOOLTIP_STYLE, trigger: 'axis' },
  legend: { data: ['渗压(kPa)', '位移(mm)', '应力(MPa)'], textStyle: { color: '#7FA8D0', fontSize: 11 }, top: 0 },
  grid: { top: 36, right: 24, bottom: 28, left: 44 },
  xAxis: { type: 'category', data: Array.from({ length: 12 }, (_, i) => `${i * 2}h`), ...AXIS_STYLE },
  yAxis: { type: 'value', ...AXIS_STYLE },
  series: [
    { name: '渗压(kPa)', type: 'line', smooth: true, symbol: 'none', data: [45, 46, 48, 50, 52, 51, 49, 47, 46, 45, 44, 45], lineStyle: { color: '#00D4FF', width: 2 }, areaStyle: { color: 'rgba(0,212,255,0.1)' } },
    { name: '位移(mm)', type: 'line', smooth: true, symbol: 'none', data: [2.1, 2.2, 2.4, 2.5, 2.6, 2.5, 2.4, 2.3, 2.2, 2.2, 2.1, 2.1], lineStyle: { color: '#FFB100', width: 2 } },
    { name: '应力(MPa)', type: 'line', smooth: true, symbol: 'none', data: [3.2, 3.3, 3.4, 3.5, 3.6, 3.5, 3.4, 3.3, 3.2, 3.2, 3.1, 3.2], lineStyle: { color: '#B37FEB', width: 2 } },
  ],
}

/* ======================= biz-public (interactive) ======================= */
const publicPeriod = ref<'month' | 'quarter' | 'year'>('month')
const publicPeriodMeta = { month: { label: '本月', f: 0.12 }, quarter: { label: '本季', f: 0.35 }, year: { label: '本年', f: 1.0 } }
const publicOfficeOption = computed(() => {
  const f = publicPeriodMeta[publicPeriod.value].f
  return {
    tooltip: { ...TOOLTIP_STYLE, trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#7FA8D0', fontSize: 11 } },
    series: [
      {
        type: 'pie', radius: ['42%', '68%'], center: ['50%', '45%'],
        itemStyle: { borderColor: '#061528', borderWidth: 2 }, label: { show: false },
        data: [
          { name: '已办文件', value: Math.round(482 * f), itemStyle: { color: '#52C41A' } },
          { name: '待办文件', value: Math.round(36 * f) + 5, itemStyle: { color: '#FFB100' } },
          { name: '已归档', value: Math.round(320 * f), itemStyle: { color: '#00D4FF' } },
          { name: '在审', value: Math.round(18 * f) + 2, itemStyle: { color: '#B37FEB' } },
        ],
      },
    ],
  }
})
const publicArchiveOption = {
  tooltip: { ...TOOLTIP_STYLE, trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: 20, right: 24, bottom: 28, left: 100 },
  xAxis: { type: 'value', max: 100, ...AXIS_STYLE },
  yAxis: { type: 'category', data: ['施工记录', '隐蔽验收', '检验批', '质量评定', '设计文件'], ...AXIS_STYLE },
  series: [
    {
      type: 'bar', data: [
        { value: 95, itemStyle: { color: '#52C41A', borderRadius: [0, 4, 4, 0] } },
        { value: 88, itemStyle: { color: '#52C41A', borderRadius: [0, 4, 4, 0] } },
        { value: 76, itemStyle: { color: '#FFB100', borderRadius: [0, 4, 4, 0] } },
        { value: 92, itemStyle: { color: '#52C41A', borderRadius: [0, 4, 4, 0] } },
        { value: 68, itemStyle: { color: '#FFB100', borderRadius: [0, 4, 4, 0] } },
      ], barWidth: '55%',
    },
  ],
}

const hasVisual = computed(() =>
  ['biz-forecast', 'biz-supply', 'biz-engineering', 'biz-public', 'biz-portal'].includes(props.moduleId),
)
</script>

<template>
  <div v-if="hasVisual" class="bzv">
    <!-- 供需水预报与决策 -->
    <template v-if="moduleId === 'biz-forecast'">
      <Panel title="灌区感知 · 四情监测" ref-tag="15.5.3.1">
        <template #actions>
          <select v-model="forecastStation" class="bzv__select" aria-label="监测站点">
            <option v-for="s in forecastStations" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </template>
        <EChart :option="forecastConditionOption" height="240px" />
      </Panel>
      <Panel title="分区需水预测（三类需水）" ref-tag="15.5.3.1">
        <EChart :option="forecastDemandOption" height="240px" />
      </Panel>
    </template>

    <!-- 供用水管理 -->
    <template v-else-if="moduleId === 'biz-supply'">
      <div class="bzv__ctrl">
        <span class="bzv__ctrl-label">典型年情景</span>
        <button
          v-for="(m, k) in supplyYearMeta"
          :key="k"
          class="bzv__pill"
          :class="{ 'bzv__pill--active': supplyYear === k }"
          :style="supplyYear === k ? { borderColor: m.color, color: m.color } : {}"
          @click="supplyYear = k as 'wet'|'normal'|'dry'"
        >{{ m.label }}</button>
      </div>
      <Panel title="水量统计与平衡（计划 vs 实际 vs 损耗）" ref-tag="15.5.3.4">
        <EChart :option="supplyVolumeOption" height="240px" />
      </Panel>
      <Panel title="分区水费收入与调水成本" ref-tag="15.5.3.4">
        <EChart :option="supplyFeeOption" height="240px" />
      </Panel>
    </template>

    <!-- 工程管理 -->
    <template v-else-if="moduleId === 'biz-engineering'">
      <div class="bzv__ctrl">
        <span class="bzv__ctrl-label">监测对象</span>
        <button
          v-for="s in engStations"
          :key="s.id"
          class="bzv__pill"
          :class="{ 'bzv__pill--active': engStation === s.id }"
          :style="engStation === s.id ? { borderColor: s.color, color: s.color } : {}"
          @click="engStation = s.id"
        >{{ s.name }}</button>
      </div>
      <div class="bzv__grid bzv__grid--2">
        <Panel title="工程安全综合评价（三级体系）" ref-tag="15.5.1.2">
          <EChart :option="engGaugeOption" height="200px" />
          <div class="bzv__eval">
            <span class="wd-chip">一级：{{ engCurrent.score >= 60 ? '正常' : '异常' }}</span>
            <span class="wd-chip">{{ engCurrent.score >= 85 ? '正常' : engCurrent.score >= 70 ? '轻度异常' : '中度异常' }}</span>
            <span class="wd-chip wd-chip--accent">{{ engCurrent.level3 }}</span>
          </div>
        </Panel>
        <Panel title="监测量过程线（渗压/位移/应力）" ref-tag="15.5.3.5">
          <EChart :option="engMonitorOption" height="260px" />
        </Panel>
      </div>
    </template>

    <!-- 水公共服务 -->
    <template v-else-if="moduleId === 'biz-public'">
      <div class="bzv__ctrl">
        <span class="bzv__ctrl-label">统计周期</span>
        <button
          v-for="(m, k) in publicPeriodMeta"
          :key="k"
          class="bzv__pill"
          :class="{ 'bzv__pill--active': publicPeriod === k }"
          @click="publicPeriod = k as 'month'|'quarter'|'year'"
        >{{ m.label }}</button>
      </div>
      <div class="bzv__grid bzv__grid--2">
        <Panel title="行政办公 · 文件流转" ref-tag="15.5.3.8">
          <EChart :option="publicOfficeOption" height="240px" />
        </Panel>
        <Panel title="电子档案归档进度（%）" ref-tag="15.5.3.8">
          <EChart :option="publicArchiveOption" height="240px" />
        </Panel>
      </div>
    </template>

    <!-- 综合门户（移动端 mock） -->
    <template v-else-if="moduleId === 'biz-portal'">
      <Panel title="移动门户 · 掌上一张图（演示）" ref-tag="15.5.3.9">
        <div class="bzv__mobile">
          <div class="bzv__phone">
            <div class="bzv__phone-notch" />
            <div class="bzv__phone-screen">
              <div class="bzv__phone-head"><span>江巷孪生</span><span class="bzv__phone-bell">🔔</span></div>
              <div class="bzv__phone-hero">
                <div class="bzv__phone-hello">掌上一张图</div>
                <div class="bzv__phone-sub">实时水雨情 · 综合预警</div>
              </div>
              <div class="bzv__phone-grid">
                <div class="bzv__phone-tile"><span>🌊</span>水雨情</div>
                <div class="bzv__phone-tile"><span>⚙</span>泵闸监控</div>
                <div class="bzv__phone-tile"><span>📡</span>设备状态</div>
                <div class="bzv__phone-tile"><span>🛡</span>安全监测</div>
                <div class="bzv__phone-tile"><span>🚨</span>综合预警</div>
                <div class="bzv__phone-tile"><span>🧭</span>移动巡查</div>
              </div>
              <div class="bzv__phone-alert"><span class="bzv__phone-dot wd-pulse" /> 蔡桥水库水位 32.4m（正常）</div>
            </div>
          </div>
          <div class="bzv__mobile-note">
            <p><strong>综合门户</strong>含 PC 工程数字门户 + 移动门户（WebAPP + 企业微信）。</p>
            <p>移动端：掌上一张图、动态信息（水雨情/泵闸/设备/安全）、综合预警、移动巡查。</p>
            <p>个性化按角色/权限展示，实时动态加载。</p>
          </div>
        </div>
      </Panel>
    </template>
  </div>
</template>

<style scoped>
.bzv { display: flex; flex-direction: column; gap: var(--wd-gap); }
.bzv__grid { display: grid; gap: var(--wd-gap); }
.bzv__grid--2 { grid-template-columns: 1fr 1fr; }
@media (max-width: 1100px) { .bzv__grid--2 { grid-template-columns: 1fr; } }
.bzv__ctrl { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 4px 0; }
.bzv__ctrl-label { font-size: 12px; color: var(--wd-text-dim); }
.bzv__pill {
  padding: 5px 12px; font-size: 12px; border: 1px solid rgba(127,168,208,0.25);
  border-radius: 999px; background: rgba(6,21,40,0.5); color: var(--wd-text-dim); transition: all 0.18s;
}
.bzv__pill--active { background: rgba(0,212,255,0.1); }
.bzv__select {
  padding: 5px 10px; background: rgba(6,21,40,0.6); border: 1px solid rgba(127,168,208,0.25);
  border-radius: 6px; color: var(--wd-text); font-size: 12px; font-family: inherit; outline: none;
}
.bzv__select:focus { border-color: var(--wd-primary); }
.bzv__eval { display: flex; gap: 6px; justify-content: center; margin-top: 8px; flex-wrap: wrap; }
.bzv__mobile { display: flex; gap: 32px; align-items: center; justify-content: center; padding: 16px; flex-wrap: wrap; }
.bzv__phone {
  width: 220px; height: 440px; background: #061528; border: 3px solid rgba(0,212,255,0.3);
  border-radius: 28px; padding: 8px; position: relative; flex-shrink: 0;
}
.bzv__phone-notch { position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 70px; height: 14px; background: rgba(0,212,255,0.2); border-radius: 0 0 10px 10px; }
.bzv__phone-screen { height: 100%; background: linear-gradient(180deg, #0b2247, #061528); border-radius: 20px; padding: 24px 14px 14px; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }
.bzv__phone-head { display: flex; justify-content: space-between; font-size: 12px; color: var(--wd-text); font-weight: 600; }
.bzv__phone-hero { background: var(--wd-gradient); border-radius: 10px; padding: 14px; color: #fff; }
.bzv__phone-hello { font-size: 16px; font-weight: 700; }
.bzv__phone-sub { font-size: 10px; opacity: 0.85; margin-top: 2px; }
.bzv__phone-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.bzv__phone-tile { aspect-ratio: 1; background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.18); border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-size: 10px; color: var(--wd-text); }
.bzv__phone-tile span { font-size: 20px; }
.bzv__phone-alert { margin-top: auto; padding: 8px 10px; background: rgba(82,196,26,0.1); border: 1px solid rgba(82,196,26,0.3); border-radius: 8px; font-size: 11px; color: var(--wd-success); display: flex; align-items: center; gap: 6px; }
.bzv__phone-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--wd-success); }
.bzv__mobile-note { max-width: 280px; font-size: 13px; color: var(--wd-text-dim); line-height: 1.8; }
.bzv__mobile-note strong { color: var(--wd-primary); }
</style>

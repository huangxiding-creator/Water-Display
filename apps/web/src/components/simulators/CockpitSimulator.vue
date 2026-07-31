<script setup lang="ts">
/**
 * Hero simulator ③ — 泵站驾驶舱 (Pump-station cockpit).
 * Owner toggles units on/off, injects a fault, and watches the three-level
 * safety evaluation light + SOE event stream + real-time gauges respond.
 * Demonstrates remote centralized monitoring (15.5.3.7) + safety model (15.5.1.2).
 */
import { ref, computed, reactive } from 'vue'
import EChart from '@/components/EChart.vue'
import { AXIS_STYLE, TOOLTIP_STYLE } from '@/composables/echarts'

interface UnitState {
  id: number
  name: string
  running: boolean
  fault: boolean
  power: number // kW
}
const units = reactive<UnitState[]>([
  { id: 1, name: '1#机组', running: true, fault: false, power: 1800 },
  { id: 2, name: '2#机组', running: true, fault: false, power: 1750 },
  { id: 3, name: '3#机组', running: true, fault: false, power: 1820 },
  { id: 4, name: '4#机组', running: false, fault: false, power: 0 },
  { id: 5, name: '5#机组', running: true, fault: false, power: 1790 },
  { id: 6, name: '6#机组', running: false, fault: false, power: 0 },
])

interface SoeEvent {
  time: string
  point: string
  desc: string
  level: 'info' | 'warn' | 'fault'
}
const soe = ref<SoeEvent[]>([
  { time: '09:00:00.012', point: '1#机组', desc: '机组启动', level: 'info' },
  { time: '09:00:02.340', point: '滁河一级站', desc: '110kV 进线合闸', level: 'info' },
  { time: '09:05:12.118', point: '3#机组', desc: '叶片角度调节 +5°', level: 'info' },
])

const runningCount = computed(() => units.filter((u) => u.running && !u.fault).length)
const totalPower = computed(() => units.filter((u) => u.running && !u.fault).reduce((s, u) => s + u.power, 0))
const totalFlow = computed(() => Math.round(runningCount.value * 20 * 10) / 10) // m³/s

// Three-level safety evaluation
const safety = computed(() => {
  const faults = units.filter((u) => u.fault).length
  if (faults === 0) return { l1: '正常', l2: '正常', l3: '正常', color: 'var(--wd-success)', level: 1 }
  if (faults === 1) return { l1: '异常', l2: '轻度异常', l3: '基本正常', color: 'var(--wd-warning)', level: 2 }
  if (faults === 2) return { l1: '异常', l2: '中度异常', l3: '局部异常', color: 'var(--wd-accent)', level: 3 }
  return { l1: '异常', l2: '重度异常', l3: '严重异常（险情）', color: 'var(--wd-danger)', level: 4 }
})

function toggleUnit(u: UnitState) {
  u.running = !u.running
  if (!u.running) u.power = 0
  else u.power = 1750 + Math.round(Math.random() * 100)
  pushSoe(u.name, u.running ? '远控启动（选择-确认-执行）' : '远控停机', u.running ? 'info' : 'warn')
}
function injectFault(u: UnitState) {
  u.fault = !u.fault
  if (u.fault) {
    u.running = false
    u.power = 0
    pushSoe(u.name, '⚠ 振动超限告警（保护跳闸）', 'fault')
  } else {
    pushSoe(u.name, '告警复归', 'info')
  }
}
function pushSoe(point: string, desc: string, level: SoeEvent['level']) {
  const t = new Date()
  const time = `${pad(t.getHours())}:${pad(t.getMinutes())}:${pad(t.getSeconds())}.${String(t.getMilliseconds()).padStart(3, '0')}`
  soe.value = [{ time, point, desc, level }, ...soe.value].slice(0, 12)
}
function pad(n: number) { return String(n).padStart(2, '0') }

const gaugeOption = computed(() => ({
  series: [
    {
      type: 'gauge',
      center: ['50%', '60%'],
      radius: '90%',
      min: 0, max: 12000,
      progress: { show: true, width: 12, itemStyle: { color: '#00D4FF' } },
      axisLine: { lineStyle: { width: 12, color: [[0.4, '#52C41A'], [0.7, '#FAAD14'], [1, '#FF4D4F']] } },
      pointer: { itemStyle: { color: 'var(--wd-text)' } },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(127,168,208,0.3)' } },
      axisLabel: { color: '#7FA8D0', fontSize: 10, distance: 18 },
      title: { show: false },
      detail: { valueAnimation: true, color: '#E6F2FF', fontSize: 22, fontFamily: 'var(--wd-font-mono)', offsetCenter: [0, '30%'], formatter: '{value} kW' },
      data: [{ value: totalPower.value }],
    },
  ],
}))

const powerTrend = {
  grid: { top: 20, right: 16, bottom: 28, left: 46 },
  tooltip: { ...TOOLTIP_STYLE, trigger: 'axis' },
  xAxis: { type: 'category', data: Array.from({ length: 20 }, (_, i) => `${i}`), ...AXIS_STYLE, axisLabel: { show: false } },
  yAxis: { type: 'value', ...AXIS_STYLE },
  series: [{
    type: 'line', smooth: true, symbol: 'none',
    data: Array.from({ length: 20 }, (_, i) => Math.round(totalPower.value * (0.9 + 0.1 * Math.sin(i / 2)))),
    lineStyle: { color: '#00D4FF' }, areaStyle: { color: 'rgba(0,212,255,0.15)' },
  }],
}
</script>

<template>
  <div class="sim">
    <div class="sim__bar">
      <div class="sim__stats">
        <div class="sim__stat"><span class="sim__stat-num">{{ runningCount }}/{{ units.length }}</span><span class="sim__stat-unit">运行机组</span></div>
        <div class="sim__stat"><span class="sim__stat-num">{{ totalFlow }}</span><span class="sim__stat-unit">m³/s 总流量</span></div>
        <div class="sim__stat"><span class="sim__stat-num">{{ totalPower }}</span><span class="sim__stat-unit">kW 总功率</span></div>
        <div class="sim__stat" :style="{ borderColor: safety.color }">
          <span class="sim__stat-num" :style="{ color: safety.color }">{{ safety.l3 }}</span>
          <span class="sim__stat-unit">三级安全评价</span>
        </div>
      </div>
    </div>

    <div class="sim__grid sim__grid--2">
      <!-- Unit controls -->
      <div class="sim__panel">
        <div class="sim__panel-title">机组远控（选择-确认-执行 · 视频联动）</div>
        <div class="ck__units">
          <div
            v-for="u in units"
            :key="u.id"
            class="ck__unit"
            :class="{ 'ck__unit--off': !u.running, 'ck__unit--fault': u.fault }"
          >
            <div class="ck__unit-head">
              <span class="ck__unit-led" :class="{ 'on': u.running && !u.fault, 'fault': u.fault }" />
              <span class="ck__unit-name">{{ u.name }}</span>
              <span class="ck__unit-status">{{ u.fault ? '故障' : u.running ? '运行' : '停机' }}</span>
            </div>
            <div class="ck__unit-power">{{ u.power }} kW</div>
            <div class="ck__unit-actions">
              <button class="ck__btn" @click="toggleUnit(u)">{{ u.running ? '停机' : '启动' }}</button>
              <button class="ck__btn ck__btn--fault" :class="{ 'ck__btn--active': u.fault }" @click="injectFault(u)">
                {{ u.fault ? '复归' : '注入故障' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Gauges -->
      <div class="sim__panel">
        <div class="sim__panel-title">实时功率仪表</div>
        <EChart :option="gaugeOption" height="200px" />
        <div class="ck__trend">
          <span class="ck__trend-label">功率趋势</span>
          <EChart :option="powerTrend" height="70px" />
        </div>
      </div>

      <!-- SOE + safety -->
      <div class="sim__panel">
        <div class="sim__panel-title">SOE 事件记录（分辨率 ≤ 2ms）+ 三级评价</div>
        <div class="ck__eval">
          <div class="ck__eval-row"><span>一级（监测量）</span><span :style="{ color: safety.color }">{{ safety.l1 }}</span></div>
          <div class="ck__eval-row"><span>二级（综合加权）</span><span :style="{ color: safety.color }">{{ safety.l2 }}</span></div>
          <div class="ck__eval-row ck__eval-row--main"><span>三级（整体）</span><span :style="{ color: safety.color }">{{ safety.l3 }}</span></div>
        </div>
        <div class="ck__soe">
          <div v-for="(e, i) in soe" :key="i" class="ck__soe-row" :class="`ck__soe-row--${e.level}`">
            <span class="ck__soe-time">{{ e.time }}</span>
            <span class="ck__soe-point">{{ e.point }}</span>
            <span class="ck__soe-desc">{{ e.desc }}</span>
          </div>
        </div>
      </div>
    </div>

    <p class="sim__note">注：滁河一级站驾驶舱演示，对应报告 15.5.3.7 + 15.5.1.2 工程安全监测模型。真实控制需经控制专网与现地级权限。</p>
  </div>
</template>

<style scoped>
@import './_sim.css';
.sim__grid--2 {
  grid-template-columns: 1.1fr 0.9fr 1fr;
}
@media (max-width: 1200px) {
  .sim__grid--2 { grid-template-columns: 1fr; }
}
.ck__units {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.ck__unit {
  padding: 10px;
  background: rgba(0, 212, 255, 0.04);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 8px;
  transition: all 0.2s;
}
.ck__unit--off {
  opacity: 0.6;
}
.ck__unit--fault {
  border-color: var(--wd-danger);
  background: rgba(255, 77, 79, 0.06);
}
.ck__unit-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--wd-text);
}
.ck__unit-led {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(127, 168, 208, 0.3);
}
.ck__unit-led.on {
  background: var(--wd-success);
  box-shadow: 0 0 8px var(--wd-success);
}
.ck__unit-led.fault {
  background: var(--wd-danger);
  box-shadow: 0 0 8px var(--wd-danger);
  animation: wd-pulse 0.8s infinite;
}
.ck__unit-name { flex: 1; }
.ck__unit-status {
  font-size: 11px;
  color: var(--wd-text-dim);
}
.ck__unit-power {
  font-family: var(--wd-font-mono);
  font-size: 14px;
  color: var(--wd-primary);
  margin: 6px 0;
}
.ck__unit-actions {
  display: flex;
  gap: 4px;
}
.ck__btn {
  flex: 1;
  padding: 4px 8px;
  font-size: 11px;
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 4px;
  background: rgba(6, 21, 40, 0.5);
  color: var(--wd-text-dim);
}
.ck__btn:hover {
  color: var(--wd-primary);
  border-color: var(--wd-primary);
}
.ck__btn--fault:hover,
.ck__btn--active {
  color: var(--wd-danger);
  border-color: var(--wd-danger);
}
.ck__trend {
  margin-top: 8px;
}
.ck__trend-label {
  font-size: 11px;
  color: var(--wd-text-dim);
}
.ck__eval {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}
.ck__eval-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  font-size: 12px;
  background: rgba(0, 212, 255, 0.03);
  border-radius: 4px;
  color: var(--wd-text-dim);
}
.ck__eval-row--main {
  font-weight: 600;
  background: rgba(0, 212, 255, 0.06);
}
.ck__soe {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-height: 200px;
  overflow-y: auto;
}
.ck__soe-row {
  display: grid;
  grid-template-columns: 110px 80px 1fr;
  gap: 8px;
  padding: 4px 8px;
  font-size: 11px;
  font-family: var(--wd-font-mono);
  border-left: 2px solid transparent;
}
.ck__soe-row--info { color: var(--wd-text-dim); border-left-color: rgba(127, 168, 208, 0.3); }
.ck__soe-row--warn { color: var(--wd-warning); border-left-color: var(--wd-warning); }
.ck__soe-row--fault { color: var(--wd-danger); border-left-color: var(--wd-danger); background: rgba(255, 77, 79, 0.04); }
.ck__soe-point {
  color: var(--wd-primary);
}
</style>

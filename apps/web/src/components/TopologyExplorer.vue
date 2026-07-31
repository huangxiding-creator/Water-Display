<script setup lang="ts">
/**
 * Interactive 1:7:624 topology explorer (15.5.2).
 * Click a sub-center → see its role & typical stations. Click the centre → overview.
 * Turns the static "1:7:624" line into an explorable network diagram.
 */
import { ref, computed } from 'vue'

interface SubCenter { id: string; name: string; role: string; stations: number }
const subCenters: SubCenter[] = [
  { id: 'jiangxiang', name: '江巷水库管理处', role: '核心水库+直供片监测', stations: 124 },
  { id: 'caiqiao', name: '蔡桥管理分局', role: '联合灌片监测+联调', stations: 96 },
  { id: 'dayu', name: '大余管理分局', role: '大余片监测', stations: 58 },
  { id: 'wansun', name: '湾孙管理处', role: '湾孙片监测', stations: 52 },
  { id: 'dunziwang', name: '墩子王水库管理处', role: '余庄片+墩子王监测', stations: 78 },
  { id: 'simashan', name: '肥东驷马山电灌处', role: '肥东片+骨干泵站', stations: 142 },
  { id: 'cuoba', name: '肥东撮八电灌处', role: '肥东撮八片', stations: 74 },
]
const activeSub = ref<string>('jiangxiang')
const activeSubData = computed(() => subCenters.find((s) => s.id === activeSub.value)!)
const totalStations = computed(() => subCenters.reduce((s, c) => s + c.stations, 0))
</script>

<template>
  <div class="tp">
    <!-- network diagram -->
    <div class="tp__net">
      <!-- centre node -->
      <div class="tp__centre">
        <span class="tp__centre-num">1</span>
        <span class="tp__centre-name">总调度中心<br><small>江巷灌区管理局</small></span>
      </div>

      <!-- sub-centers around -->
      <div class="tp__subs">
        <button
          v-for="s in subCenters"
          :key="s.id"
          class="tp__sub"
          :class="{ 'is-active': activeSub === s.id }"
          @click="activeSub = s.id"
        >
          <span class="tp__sub-name">{{ s.name }}</span>
          <span class="tp__sub-stations">{{ s.stations }} 站</span>
          <span class="tp__sub-line" />
        </button>
      </div>
    </div>

    <!-- summary -->
    <div class="tp__summary">
      <div class="tp__sum-item"><b>1</b><span>总调度中心</span></div>
      <div class="tp__sum-item"><b>7</b><span>分调度中心</span></div>
      <div class="tp__sum-item"><b>{{ totalStations }}</b><span>遥测站（含流量{{ ' ' }}325 + 水位{{ ' ' }}299）</span></div>
      <div class="tp__sum-item"><b>4G/GPRS</b><span>自报/应答兼容</span></div>
    </div>

    <!-- active sub detail -->
    <transition name="tp-fade" mode="out-in">
      <div :key="activeSub" class="tp__detail">
        <span class="tp__detail-dot" />
        <div>
          <div class="tp__detail-name">{{ activeSubData.name }} <span class="wd-tag">分调度中心</span></div>
          <div class="tp__detail-role">{{ activeSubData.role }}</div>
          <div class="tp__detail-stations">下辖 <b>{{ activeSubData.stations }}</b> 个遥测站点 · 含流量/水位/视频/工情</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.tp { display: flex; flex-direction: column; gap: 16px; }

.tp__net { display: flex; gap: 30px; align-items: center; padding: 16px; background: radial-gradient(ellipse at left, rgba(0,212,255,0.06), transparent 60%); border-radius: 12px; border: 1px solid rgba(0,212,255,0.12); }
.tp__centre { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 18px 20px; background: var(--wd-gradient); border-radius: 14px; color: #fff; min-width: 110px; box-shadow: 0 8px 24px rgba(0,102,255,0.35); flex-shrink: 0; }
.tp__centre-num { font-family: var(--wd-font-mono); font-size: 32px; font-weight: 700; line-height: 1; }
.tp__centre-name { font-size: 12px; text-align: center; line-height: 1.4; }
.tp__centre-name small { font-size: 10px; opacity: 0.85; }

.tp__subs { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; flex: 1; }
.tp__sub { position: relative; display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border-radius: 8px; background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.2); cursor: pointer; text-align: left; transition: all 0.18s; }
.tp__sub:hover { background: rgba(0,212,255,0.1); }
.tp__sub.is-active { background: rgba(0,212,255,0.14); border-color: var(--wd-primary); box-shadow: 0 0 0 1px var(--wd-primary); }
.tp__sub-name { font-size: 12px; font-weight: 600; color: var(--wd-text); }
.tp__sub-stations { font-size: 11px; color: var(--wd-accent); font-family: var(--wd-font-mono); }
.tp__sub-line { position: absolute; left: -22px; top: 50%; width: 22px; height: 1px; background: linear-gradient(90deg, rgba(0,212,255,0.5), rgba(0,212,255,0.15)); }

.tp__summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
@media (max-width: 800px) { .tp__summary { grid-template-columns: repeat(2, 1fr); } }
.tp__sum-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 14px; background: rgba(0,212,255,0.04); border: 1px solid rgba(0,212,255,0.15); border-radius: 8px; }
.tp__sum-item b { font-family: var(--wd-font-mono); font-size: 22px; color: var(--wd-primary); }
.tp__sum-item span { font-size: 11px; color: var(--wd-text-dim); text-align: center; }

.tp__detail { display: flex; gap: 12px; padding: 14px 16px; background: rgba(255,177,0,0.05); border: 1px solid rgba(255,177,0,0.2); border-radius: 8px; }
.tp__detail-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--wd-accent); box-shadow: 0 0 8px var(--wd-accent); margin-top: 5px; flex-shrink: 0; }
.tp__detail-name { font-size: 14px; font-weight: 600; color: var(--wd-text); }
.tp__detail-role { font-size: 12px; color: var(--wd-text-dim); margin-top: 2px; }
.tp__detail-stations { font-size: 12px; color: var(--wd-text); margin-top: 4px; }
.tp__detail-stations b { color: var(--wd-accent); font-family: var(--wd-font-mono); }

.tp-fade-enter-active, .tp-fade-leave-active { transition: opacity 0.2s; }
.tp-fade-enter-from, .tp-fade-leave-to { opacity: 0; }
</style>

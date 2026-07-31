<script setup lang="ts">
/**
 * 灌区一张图 — interactive GIS map of the Jiangxiang irrigation district.
 * Plots the REAL geo coordinates extracted from the report (15.5.2.1):
 * reservoirs, pump stations, video towers, UAV airports, management offices.
 *
 * Uses Leaflet (lightweight, online tiles). When offline, tiles fail to load
 * but the markers still render on a dark base — graceful degradation.
 */
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { project } from '@/data/project'
import PageHeader from '@/components/PageHeader.vue'
import Panel from '@/components/Panel.vue'
import FeatureRow from '@/components/FeatureRow.vue'

const mapEl = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null

const TYPE_META: Record<string, { label: string; color: string; icon: string }> = {
  reservoir: { label: '水库', color: '#00D4FF', icon: '💧' },
  pump: { label: '泵站', color: '#FFB100', icon: '⚙' },
  sluice: { label: '涵闸', color: '#B37FEB', icon: '⛩' },
  canal: { label: '渠道', color: '#36CFC9', icon: '〰' },
  'video-tower': { label: '视频铁塔', color: '#FF4D4F', icon: '📡' },
  uav: { label: '无人机机场', color: '#52C41A', icon: '🚁' },
  monitor: { label: '监测站', color: '#7FA8D0', icon: '📍' },
  office: { label: '管理机构', color: '#FF85C0', icon: '🏛' },
}

const activeTypes = ref(new Set(Object.keys(TYPE_META)))

const points = computed(() => project.engineering.geoPoints)

function toggleType(t: string) {
  const next = new Set(activeTypes.value)
  if (next.has(t)) next.delete(t)
  else next.add(t)
  activeTypes.value = next
  renderMarkers()
}

function makeIcon(color: string, icon: string): L.DivIcon {
  return L.divIcon({
    className: 'om-marker',
    html: `<div style="--c:${color}" class="om-marker__dot"><span>${icon}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

function renderMarkers() {
  if (!markerLayer) return
  markerLayer.clearLayers()
  for (const p of points.value) {
    const t = p.type ?? 'monitor'
    if (!activeTypes.value.has(t)) continue
    const meta = TYPE_META[t] ?? TYPE_META.monitor
    const m = L.marker([p.lat, p.lng], { icon: makeIcon(meta.color, meta.icon) })
    m.bindPopup(
      `<div class="om-popup"><div class="om-popup__name">${p.name}</div>` +
        `<div class="om-popup__type">${meta.label}</div>` +
        (p.remark ? `<div class="om-popup__remark">${p.remark}</div>` : '') +
        `<div class="om-popup__coord">${p.lng.toFixed(5)}, ${p.lat.toFixed(5)}</div></div>`,
    )
    markerLayer.addLayer(m)
  }
}

onMounted(() => {
  if (!mapEl.value) return
  // Center on Jiangxiang reservoir area
  map = L.map(mapEl.value, { zoomControl: true, attributionControl: false }).setView([32.3, 117.6], 10)

  // Dark base layer (online only; fails gracefully offline leaving dark CSS bg)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 18,
    className: 'om-tiles',
  }).addTo(map)

  markerLayer = L.layerGroup().addTo(map)
  renderMarkers()

  // Draw an irrigation-area circle around the centroid for context
  L.circle([32.3, 117.6], {
    radius: 25000,
    color: '#00D4FF',
    weight: 1.5,
    opacity: 0.5,
    fillColor: '#00D4FF',
    fillOpacity: 0.04,
    dashArray: '6 6',
  }).addTo(map)
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})

const subModules = project.businessModules.find((m) => m.id === 'biz-onemap')?.subModules ?? []
</script>

<template>
  <div class="cp">
    <PageHeader title="灌区一张图" ref-tag="15.5.3.6" subtitle="统一GIS空间数据可视化平台 · 真实工程坐标 · 空间中枢" />

    <Panel title="工程空间分布（真实坐标）" class="cp__block om-wrap">
      <template #actions>
        <span class="om-hint">共 {{ points.length }} 个要素 · 点击图例切换图层</span>
      </template>
      <div class="om-layout">
        <div ref="mapEl" class="om-map" />
        <aside class="om-legend">
          <div class="om-legend__title">图层</div>
          <button
            v-for="(meta, t) in TYPE_META"
            :key="t"
            class="om-legend__item"
            :class="{ 'is-off': !activeTypes.has(t) }"
            @click="toggleType(t)"
          >
            <span class="om-legend__dot" :style="{ background: meta.color }">{{ meta.icon }}</span>
            <span class="om-legend__label">{{ meta.label }}</span>
            <span class="om-legend__count">{{ points.filter((p) => (p.type ?? 'monitor') === t).length }}</span>
          </button>
          <div class="om-legend__foot">
            💡 在线时显示地图底图；离线时仅显示要素分布（演示降级）
          </div>
        </aside>
      </div>
    </Panel>

    <Panel title="一张图功能要点（可批注）" ref-tag="15.5.3.6" class="cp__block">
      <div v-for="(sub, i) in subModules" :key="i" class="biz__sub">
        <div class="biz__sub-head">{{ sub.name }}</div>
        <FeatureRow
          v-for="f in sub.features"
          :key="f.name"
          :name="f.name"
          :desc="f.desc"
          chapter-id="biz-onemap"
          chapter-title="灌区一张图"
        />
      </div>
    </Panel>
  </div>
</template>

<style scoped>
@import '@/styles/_chapter.css';

.om-wrap :deep(.body) {
  padding: 0;
}
.om-hint {
  font-size: 11px;
  color: var(--wd-text-dim);
}
.om-layout {
  display: flex;
  height: 480px;
}
.om-map {
  flex: 1;
  background: #0a1929;
  position: relative;
}
.om-map :deep(.leaflet-container) {
  background: #0a1929;
  font-family: var(--wd-font);
}
.om-legend {
  width: 200px;
  flex-shrink: 0;
  padding: 14px;
  background: rgba(6, 21, 40, 0.6);
  border-left: 1px solid rgba(0, 212, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}
.om-legend__title {
  font-size: 12px;
  color: var(--wd-primary);
  font-weight: 600;
  margin-bottom: 4px;
}
.om-legend__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  background: rgba(0, 212, 255, 0.04);
  border: 1px solid transparent;
  font-size: 12px;
  color: var(--wd-text);
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.15s;
}
.om-legend__item:hover {
  background: rgba(0, 212, 255, 0.1);
}
.om-legend__item.is-off {
  opacity: 0.35;
}
.om-legend__dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
  color: #061528;
  font-weight: 700;
}
.om-legend__label {
  flex: 1;
}
.om-legend__count {
  font-family: var(--wd-font-mono);
  font-size: 11px;
  color: var(--wd-text-dim);
}
.om-legend__foot {
  margin-top: auto;
  padding-top: 10px;
  font-size: 10px;
  color: var(--wd-text-dim);
  line-height: 1.6;
  opacity: 0.8;
}

/* Leaflet custom markers (global, via :deep) */
.om-wrap :deep(.om-marker__dot) {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--c);
  border: 2px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 10px var(--c);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #061528;
  font-weight: 700;
  transition: transform 0.15s;
}
.om-wrap :deep(.om-marker__dot:hover) {
  transform: scale(1.2);
}
.om-wrap :deep(.om-popup) {
  font-family: var(--wd-font);
}
.om-wrap :deep(.om-popup__name) {
  font-size: 13px;
  font-weight: 600;
  color: #0b2247;
}
.om-wrap :deep(.om-popup__type) {
  font-size: 11px;
  color: #0066ff;
  margin: 2px 0;
}
.om-wrap :deep(.om-popup__remark) {
  font-size: 11px;
  color: #555;
  margin: 4px 0;
}
.om-wrap :deep(.om-popup__coord) {
  font-size: 10px;
  color: #999;
  font-family: monospace;
}
.om-wrap :deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}
</style>

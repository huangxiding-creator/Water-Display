<script setup lang="ts">
/**
 * Interactive data-foundation visual:
 *  (A) animated data flow: 数据资源 → 归集库 → 治理 → 基础库 → 主题库 → 业务/共享
 *  (B) L1/L2/L3 precision explorer — click a level to see scope & precision.
 * Realises 数据底板 (15.5.1.1) as a living diagram, not static text.
 */
import { ref, computed } from 'vue'
import { project } from '@/data/project'

const playing = ref(true)

const flowNodes = [
  { name: '数据资源', sub: '5大类采集', color: '#7FA8D0' },
  { name: '归集库', sub: '标准化目录', color: '#0066FF' },
  { name: '数据治理', sub: '汇聚·清洗·校核', color: '#FFB100' },
  { name: '基础库', sub: '主题化整编', color: '#36CFC9' },
  { name: '主题库', sub: '面向业务', color: '#00D4FF' },
  { name: '业务应用 / 省厅共享', sub: '对外服务', color: '#52C41A' },
]

const levels = project.twinPlatform.dataLevels
const activeLevel = ref(0)
const activeLevelData = computed(() => levels[activeLevel.value])

const precisionBar = computed(() => {
  // visualise precision numerically: L1 ~15, L2 ~2, L3 ~0.03
  const map = ['L1', 'L2', 'L3'] as const
  const val = map[activeLevel.value]
  const v = val === 'L1' ? 15 : val === 'L2' ? 2 : 0.03
  return v
})
</script>

<template>
  <div class="dfd">
    <!-- (A) animated flow -->
    <div class="dfd__flow" :class="{ 'is-playing': playing }">
      <template v-for="(n, i) in flowNodes" :key="n.name">
        <div class="dfd__node" :style="{ '--c': n.color }">
          <span class="dfd__node-name">{{ n.name }}</span>
          <span class="dfd__node-sub">{{ n.sub }}</span>
        </div>
        <span v-if="i < flowNodes.length - 1" class="dfd__pipe">
          <span class="dfd__particle" />
          <span class="dfd__particle dfd__particle--2" />
        </span>
      </template>
      <button class="dfd__play" @click="playing = !playing">{{ playing ? '⏸ 暂停' : '▶ 播放' }}</button>
    </div>

    <!-- (B) L1/L2/L3 explorer -->
    <div class="dfd__levels">
      <div class="dfd__level-tabs">
        <button
          v-for="(lv, i) in levels"
          :key="lv.level"
          class="dfd__level-tab"
          :class="{ 'is-active': activeLevel === i }"
          @click="activeLevel = i"
        >{{ lv.level }} 级</button>
        <span class="dfd__level-hint">点击切换精度等级</span>
      </div>

      <transition name="dfd-fade" mode="out-in">
        <div :key="activeLevel" class="dfd__level-detail">
          <div class="dfd__precision">
            <span class="dfd__precision-label">空间精度</span>
            <div class="dfd__precision-bar">
              <div class="dfd__precision-fill" :style="{ width: precisionBar > 1 ? '100%' : `${(precisionBar / 2) * 100}%` }" />
            </div>
            <span class="dfd__precision-val">{{ activeLevelData?.precision }}</span>
          </div>
          <div class="dfd__scope">
            <span class="dfd__scope-label">建设范围</span>
            <p>{{ activeLevelData?.scope }}</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- data category chips -->
    <div class="dfd__cats">
      <span class="dfd__cats-label">数据资源类别（{{ project.twinPlatform.dataCategories.length }}）</span>
      <div class="dfd__cat-list">
        <span v-for="c in project.twinPlatform.dataCategories" :key="c.name" class="dfd__cat">
          {{ c.name }} <b>{{ c.count }}</b>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dfd { display: flex; flex-direction: column; gap: 18px; }

.dfd__flow { display: flex; align-items: center; gap: 0; flex-wrap: wrap; position: relative; padding: 8px 0; }
.dfd__node {
  display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 12px 14px; min-width: 96px;
  background: color-mix(in srgb, var(--c) 12%, transparent); border: 1px solid color-mix(in srgb, var(--c) 35%, transparent);
  border-radius: 10px;
}
.dfd__node-name { font-size: 13px; font-weight: 600; color: var(--wd-text); }
.dfd__node-sub { font-size: 10px; color: var(--wd-text-dim); }
.dfd__pipe { position: relative; width: 34px; height: 2px; background: linear-gradient(90deg, rgba(0,212,255,0.5), rgba(0,212,255,0.15)); }
.dfd__particle {
  position: absolute; top: -3px; left: 0; width: 8px; height: 8px; border-radius: 50%;
  background: var(--wd-primary); box-shadow: 0 0 10px var(--wd-primary);
}
.is-playing .dfd__particle { animation: dfd-flow 1.6s linear infinite; }
.is-playing .dfd__particle--2 { animation-delay: 0.8s; }
@keyframes dfd-flow { from { left: 0; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } to { left: 26px; opacity: 0; } }
.dfd__play {
  position: absolute; top: -6px; right: 0; padding: 5px 10px; font-size: 11px; border-radius: 6px;
  background: rgba(6,21,40,0.6); border: 1px solid rgba(0,212,255,0.3); color: var(--wd-primary); cursor: pointer;
}

.dfd__levels { padding: 14px; background: rgba(0,212,255,0.03); border: 1px solid rgba(0,212,255,0.12); border-radius: 10px; }
.dfd__level-tabs { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.dfd__level-tab { padding: 7px 18px; font-size: 13px; font-weight: 600; border-radius: 8px; border: 1px solid rgba(127,168,208,0.2); background: rgba(6,21,40,0.5); color: var(--wd-text-dim); cursor: pointer; transition: all 0.18s; }
.dfd__level-tab.is-active { color: var(--wd-primary); border-color: var(--wd-primary); background: rgba(0,212,255,0.1); box-shadow: 0 0 12px rgba(0,212,255,0.25); }
.dfd__level-hint { font-size: 11px; color: var(--wd-text-dim); margin-left: auto; }
.dfd__level-detail { display: flex; flex-direction: column; gap: 12px; }
.dfd__precision { display: flex; align-items: center; gap: 12px; }
.dfd__precision-label, .dfd__scope-label { font-size: 11px; color: var(--wd-primary); min-width: 64px; text-transform: uppercase; letter-spacing: 1px; }
.dfd__precision-bar { flex: 1; height: 8px; background: rgba(127,168,208,0.12); border-radius: 4px; overflow: hidden; }
.dfd__precision-fill { height: 100%; background: var(--wd-gradient); border-radius: 4px; transition: width 0.4s; }
.dfd__precision-val { font-family: var(--wd-font-mono); font-size: 13px; color: var(--wd-accent); font-weight: 600; min-width: 160px; }
.dfd__scope { display: flex; gap: 12px; }
.dfd__scope p { margin: 0; font-size: 13px; color: var(--wd-text); line-height: 1.7; }

.dfd__cats { display: flex; flex-direction: column; gap: 8px; }
.dfd__cats-label { font-size: 11px; color: var(--wd-text-dim); }
.dfd__cat-list { display: flex; flex-wrap: wrap; gap: 6px; }
.dfd__cat { font-size: 12px; padding: 5px 11px; border-radius: 6px; background: rgba(0,212,255,0.06); border: 1px solid rgba(0,212,255,0.15); color: var(--wd-text); }
.dfd__cat b { color: var(--wd-accent); font-family: var(--wd-font-mono); }

.dfd-fade-enter-active, .dfd-fade-leave-active { transition: opacity 0.2s; }
.dfd-fade-enter-from, .dfd-fade-leave-to { opacity: 0; }
</style>

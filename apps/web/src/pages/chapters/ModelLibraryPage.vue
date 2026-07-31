<script setup lang="ts">
import { ref, computed } from 'vue'
import { project } from '@/data/project'
import PageHeader from '@/components/PageHeader.vue'
import Panel from '@/components/Panel.vue'
import EChart from '@/components/EChart.vue'
import AnnotateButton from '@/components/AnnotateButton.vue'
import { AXIS_STYLE, TOOLTIP_STYLE } from '@/composables/echarts'

const activeCategory = ref<string>('全部')
const categories = computed(() => ['全部', ...new Set(project.twinPlatform.models.map((m) => m.category))])
const filtered = computed(() =>
  activeCategory.value === '全部'
    ? project.twinPlatform.models
    : project.twinPlatform.models.filter((m) => m.category === activeCategory.value),
)
const expanded = ref<string | null>(project.twinPlatform.models[0]?.id ?? null)
function toggle(id: string) {
  expanded.value = expanded.value === id ? null : id
}

/* ---- visualization data ---- */
const SIYU = ['预报', '预警', '预演', '预案'] as const
// which 四预 each model supports: [预报,预警,预演,预案]
const COVERAGE: Record<string, number[]> = {
  'm-hydroforecast': [1, 0, 0, 0],
  'm-demand': [1, 0, 0, 0],
  'm-hydro': [0, 0, 1, 0],
  'm-alloc': [0, 0, 0, 1],
  'm-joint': [0, 0, 1, 0],
  'm-flood': [1, 1, 1, 1],
  'm-pump': [0, 0, 0, 1],
  'm-safety': [0, 1, 0, 0],
  'm-ai-vision': [0, 1, 0, 0],
  'm-sim-engine': [0, 0, 1, 0],
  'm-remote-sensing': [1, 0, 0, 0],
}
function siyuOf(id: string): string[] {
  return SIYU.filter((_, i) => COVERAGE[id]?.[i])
}

// heatmap: models × 四预
const heatOption = computed(() => {
  const models = project.twinPlatform.models
  return {
    tooltip: { ...TOOLTIP_STYLE, formatter: (p: any) => `${models[p.value[1]].name} → ${SIYU[p.value[0]]}：${p.value[2] ? '✓ 支撑' : '—'}` },
    grid: { top: 20, right: 30, bottom: 24, left: 130 },
    xAxis: { type: 'category', data: [...SIYU], ...AXIS_STYLE, splitArea: { show: true }, axisLabel: { ...AXIS_STYLE.axisLabel, color: '#00D4FF' } },
    yAxis: { type: 'category', data: models.map((m) => m.name), ...AXIS_STYLE, splitArea: { show: true }, axisLabel: { color: '#7FA8D0', fontSize: 11 } },
    visualMap: { show: false, min: 0, max: 1, inRange: { color: ['#0B2247', '#00D4FF'] } },
    series: [
      {
        type: 'heatmap', data: models.flatMap((_, mi) => SIYU.map((_, si) => [si, mi, COVERAGE[models[mi].id]?.[si] ?? 0])),
        label: { show: true, formatter: (p: any) => (p.value[2] ? '●' : ''), color: '#061528', fontSize: 16 },
        itemStyle: { borderColor: '#061528', borderWidth: 2, borderRadius: 3 },
        emphasis: { itemStyle: { shadowBlur: 10 } },
      },
    ],
  }
})

// category distribution
const catBarOption = computed(() => {
  const counts = new Map<string, number>()
  for (const m of project.twinPlatform.models) counts.set(m.category, (counts.get(m.category) ?? 0) + 1)
  const cats = [...counts.entries()].sort((a, b) => b[1] - a[1])
  const colors = ['#00D4FF', '#0066FF', '#FFB100', '#52C41A', '#B37FEB', '#FF7A45']
  return {
    tooltip: { ...TOOLTIP_STYLE, trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 16, right: 24, bottom: 24, left: 130 },
    xAxis: { type: 'value', ...AXIS_STYLE, max: 7 },
    yAxis: { type: 'category', data: cats.map((c) => c[0]), ...AXIS_STYLE },
    series: [
      {
        type: 'bar',
        data: cats.map((c, i) => ({ value: c[1], itemStyle: { color: colors[i % colors.length], borderRadius: [0, 4, 4, 0] } })),
        label: { show: true, position: 'right', color: '#E6F2FF', fontSize: 11 },
        barWidth: '55%',
      },
    ],
  }
})

// curated algorithm chain (the narrative of how models feed each other)
const CHAIN = [
  { name: '水文预报', id: 'm-hydroforecast', sub: '来水' },
  { name: '需水预测', id: 'm-demand', sub: '需水' },
  { name: '水资源配置', id: 'm-alloc', sub: '方案' },
  { name: '输配水联合调度', id: 'm-joint', sub: '预演' },
]
const CHAIN_OUT = [
  { name: '防洪调度', id: 'm-flood' },
  { name: '泵站经济运行', id: 'm-pump' },
]
const CHAIN_SUPPORT = ['水动力学（耦合）', '工程安全监测（预警）', '智能识别（监测）', '数字仿真引擎（承载预演）', '地面标定（遥感真值）']
</script>

<template>
  <div class="cp">
    <PageHeader title="模型库" ref-tag="15.5.1.2" subtitle="水利专业模型 / 地面标定 / 工程安全 / 智能识别 / 仿真引擎 — 提供「算法」保证，支撑四预功能" />

    <!-- ============ 算法链路（模型如何相互喂数据） ============ -->
    <Panel title="算法链路 · 模型协同关系" ref-tag="15.5.1.2" class="cp__block">
      <div class="ml-chain">
        <div class="ml-chain__main">
          <template v-for="(node, i) in CHAIN" :key="node.id">
            <div class="ml-chain__node ml-chain__node--core" @click="expanded = node.id">
              <span class="ml-chain__name">{{ node.name }}</span>
              <span class="ml-chain__sub">{{ node.sub }}</span>
            </div>
            <span v-if="i < CHAIN.length - 1" class="ml-chain__arrow">→</span>
          </template>
          <span class="ml-chain__arrow ml-chain__arrow--split">⇉</span>
          <div class="ml-chain__out">
            <div v-for="o in CHAIN_OUT" :key="o.id" class="ml-chain__node ml-chain__node--out" @click="expanded = o.id">
              {{ o.name }}
            </div>
          </div>
        </div>
        <div class="ml-chain__support">
          <span class="ml-chain__support-label">支撑层</span>
          <span v-for="s in CHAIN_SUPPORT" :key="s" class="ml-chain__support-tag">{{ s }}</span>
        </div>
      </div>
    </Panel>

    <!-- ============ 四预覆盖 + 分类分布 ============ -->
    <div class="ml-visual-grid">
      <Panel title="四预功能覆盖矩阵" ref-tag="15.5.1.2">
        <EChart :option="heatOption" height="340px" />
      </Panel>
      <Panel title="模型分类分布" ref-tag="15.5.1.2">
        <EChart :option="catBarOption" height="340px" />
      </Panel>
    </div>

    <Panel title="模型分类筛选" class="cp__block">
      <div class="ml__cats">
        <button
          v-for="c in categories"
          :key="c"
          class="ml__cat"
          :class="{ 'ml__cat--active': activeCategory === c }"
          @click="activeCategory = c"
        >
          {{ c }}
          <span class="ml__cat-count">{{
            c === '全部' ? project.twinPlatform.models.length : project.twinPlatform.models.filter((m) => m.category === c).length
          }}</span>
        </button>
      </div>
    </Panel>

    <div class="ml__list">
      <article
        v-for="m in filtered"
        :key="m.id"
        class="ml__card wd-panel wd-fade-in"
        :class="{ 'ml__card--open': expanded === m.id }"
      >
        <header class="ml__head" @click="toggle(m.id)">
          <div class="ml__head-left">
            <span class="ml__cat-tag">{{ m.category }}</span>
            <h3 class="ml__name">{{ m.name }}</h3>
            <span v-if="m.simulator !== 'none'" class="ml__sim wd-chip wd-chip--accent">🎮 含模拟器</span>
          </div>
          <div class="ml__head-right">
            <span class="ml__purpose">{{ m.purpose }}</span>
            <span class="ml__expand" :class="{ 'is-open': expanded === m.id }">▾</span>
          </div>
        </header>

        <transition name="ml-detail">
          <div v-if="expanded === m.id" class="ml__detail">
            <!-- 四预 coverage badges -->
            <div class="ml__siyu">
              <span class="ml__siyu-label">支撑四预：</span>
              <span v-for="s in SIYU" :key="s" class="ml__siyu-pill" :class="{ 'is-on': siyuOf(m.id).includes(s) }">{{ s }}</span>
            </div>

            <!-- visual input → algorithm → output flow -->
            <div class="ml__flow">
              <div class="ml__flow-col">
                <span class="ml__flow-label">输入</span>
                <div class="ml__flow-tags">
                  <span v-for="inp in m.inputs" :key="inp" class="ml__chip ml__chip--in">{{ inp }}</span>
                </div>
              </div>
              <span class="ml__flow-arrow">→</span>
              <div class="ml__flow-col ml__flow-col--mid">
                <span class="ml__flow-label">算法</span>
                <div class="ml__flow-tags">
                  <span v-for="mt in m.methods" :key="mt" class="ml__chip ml__chip--algo">⚙ {{ mt }}</span>
                </div>
              </div>
              <span class="ml__flow-arrow">→</span>
              <div class="ml__flow-col">
                <span class="ml__flow-label">输出</span>
                <div class="ml__flow-tags">
                  <span v-for="out in m.outputs" :key="out" class="ml__chip ml__chip--out">{{ out }}</span>
                </div>
              </div>
            </div>

            <div class="ml__meta">
              <div><span class="ml__field-label">目的</span><p>{{ m.purpose }}</p></div>
              <div v-if="m.scope"><span class="ml__field-label">适用范围</span><p>{{ m.scope }}</p></div>
            </div>

            <div class="ml__annotate-row">
              <span class="ml__field-label">对此模型的意见</span>
              <AnnotateButton :feature="`模型库·${m.name}`" chapter-id="model-library" chapter-title="模型库" />
            </div>

            <router-link v-if="m.simulator === 'dispatch'" to="/biz-allocation" class="ml__go">前往调度预演模拟器 →</router-link>
            <router-link v-else-if="m.simulator === 'flood'" to="/biz-disaster" class="ml__go">前往洪水淹没模拟器 →</router-link>
            <router-link v-else-if="m.simulator === 'cockpit'" to="/biz-monitor" class="ml__go">前往泵站驾驶舱模拟器 →</router-link>
          </div>
        </transition>
      </article>
    </div>
  </div>
</template>

<style scoped>
@import '@/styles/_chapter.css';

/* ---- algorithm chain ---- */
.ml-chain { display: flex; flex-direction: column; gap: 16px; }
.ml-chain__main { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
.ml-chain__node {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 10px 16px; border-radius: 10px; cursor: pointer; transition: all 0.18s; min-width: 96px;
}
.ml-chain__node--core {
  background: linear-gradient(160deg, rgba(0,212,255,0.12), rgba(0,102,255,0.06));
  border: 1px solid rgba(0,212,255,0.35);
}
.ml-chain__node--core:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,212,255,0.2); }
.ml-chain__node--out {
  background: rgba(255,177,0,0.08); border: 1px solid rgba(255,177,0,0.3); color: var(--wd-accent); font-size: 12px;
}
.ml-chain__name { font-size: 13px; font-weight: 600; color: var(--wd-text); }
.ml-chain__sub { font-size: 10px; color: var(--wd-text-dim); }
.ml-chain__arrow { color: var(--wd-primary); font-size: 18px; font-weight: 700; }
.ml-chain__arrow--split { color: var(--wd-accent); }
.ml-chain__out { display: flex; flex-direction: column; gap: 6px; }
.ml-chain__support { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; padding-top: 12px; border-top: 1px dashed rgba(127,168,208,0.15); }
.ml-chain__support-label { font-size: 11px; color: var(--wd-text-dim); }
.ml-chain__support-tag { font-size: 11px; padding: 3px 10px; border-radius: 999px; background: rgba(127,168,208,0.08); color: var(--wd-text-dim); border: 1px solid rgba(127,168,208,0.12); }

.ml-visual-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: var(--wd-gap); }
@media (max-width: 1200px) { .ml-visual-grid { grid-template-columns: 1fr; } }

/* ---- 四预 pills + flow ---- */
.ml__siyu { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.ml__siyu-label { font-size: 12px; color: var(--wd-text-dim); }
.ml__siyu-pill { font-size: 11px; padding: 3px 10px; border-radius: 999px; background: rgba(127,168,208,0.08); color: var(--wd-text-dim); border: 1px solid transparent; opacity: 0.35; }
.ml__siyu-pill.is-on { opacity: 1; color: var(--wd-primary); background: rgba(0,212,255,0.12); border-color: rgba(0,212,255,0.4); box-shadow: 0 0 8px rgba(0,212,255,0.25); }

.ml__flow { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 10px; padding: 14px; background: rgba(0,212,255,0.03); border: 1px solid rgba(0,212,255,0.12); border-radius: 10px; margin-bottom: 14px; }
.ml__flow-col { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.ml__flow-col--mid { }
.ml__flow-label { font-size: 10px; color: var(--wd-primary); text-transform: uppercase; letter-spacing: 1px; }
.ml__flow-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.ml__flow-arrow { color: var(--wd-primary); font-size: 20px; font-weight: 700; text-align: center; }
.ml__chip { font-size: 11px; padding: 4px 9px; border-radius: 6px; line-height: 1.4; }
.ml__chip--in { background: rgba(0,102,255,0.12); color: #6FB0FF; border: 1px solid rgba(0,102,255,0.25); }
.ml__chip--algo { background: rgba(255,177,0,0.1); color: var(--wd-accent); border: 1px solid rgba(255,177,0,0.25); }
.ml__chip--out { background: rgba(82,196,26,0.1); color: var(--wd-success); border: 1px solid rgba(82,196,26,0.25); }
.ml__meta { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px; }
@media (max-width: 800px) { .ml__meta { grid-template-columns: 1fr; } }
.ml__meta p { margin: 4px 0 0; font-size: 12.5px; color: var(--wd-text); line-height: 1.7; }
.ml__annotate-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0 0; border-top: 1px solid rgba(127,168,208,0.1); }

.ml__cats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ml__cat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(6, 21, 40, 0.5);
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 999px;
  color: var(--wd-text-dim);
  font-size: 12px;
  transition: all 0.18s;
}
.ml__cat--active {
  border-color: var(--wd-primary);
  color: var(--wd-primary);
  background: rgba(0, 212, 255, 0.1);
}
.ml__cat-count {
  font-family: var(--wd-font-mono);
  opacity: 0.7;
  font-size: 11px;
}

.ml__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ml__card {
  overflow: hidden;
  transition: border-color 0.2s;
}
.ml__card--open {
  border-color: rgba(0, 212, 255, 0.4);
}
.ml__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  cursor: pointer;
  transition: background 0.15s;
}
.ml__head:hover {
  background: rgba(0, 212, 255, 0.03);
}
.ml__head-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.ml__cat-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0, 212, 255, 0.1);
  color: var(--wd-primary);
  flex-shrink: 0;
}
.ml__name {
  margin: 0;
  font-size: 15px;
  color: var(--wd-text);
}
.ml__head-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.ml__purpose {
  font-size: 12px;
  color: var(--wd-text-dim);
  max-width: 420px;
  text-align: right;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ml__expand {
  color: var(--wd-text-dim);
  transition: transform 0.2s;
}
.ml__expand.is-open {
  transform: rotate(180deg);
}

.ml__detail {
  padding: 0 18px 18px;
  border-top: 1px solid rgba(0, 212, 255, 0.1);
}
.ml__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  padding-top: 14px;
}
@media (max-width: 800px) {
  .ml__grid { grid-template-columns: 1fr; }
}
.ml__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ml__field--annotate {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.ml__field-label {
  font-size: 11px;
  color: var(--wd-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.ml__field p {
  margin: 0;
  font-size: 13px;
  color: var(--wd-text);
  line-height: 1.7;
}
.ml__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.ml__go {
  display: inline-block;
  margin-top: 12px;
  font-size: 13px;
  color: var(--wd-accent);
}
.ml-detail-enter-active,
.ml-detail-leave-active {
  transition: opacity 0.2s, max-height 0.25s ease;
  overflow: hidden;
  max-height: 500px;
}
.ml-detail-enter-from,
.ml-detail-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>

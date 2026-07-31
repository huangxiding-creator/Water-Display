<script setup lang="ts">
import { ref, computed } from 'vue'
import { project } from '@/data/project'
import PageHeader from '@/components/PageHeader.vue'
import Panel from '@/components/Panel.vue'
import AnnotateButton from '@/components/AnnotateButton.vue'

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
</script>

<template>
  <div class="cp">
    <PageHeader title="模型库" ref-tag="15.5.1.2" subtitle="水利专业模型 / 地面标定 / 工程安全 / 智能识别 / 仿真引擎 — 提供「算法」保证，支撑四预功能" />

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
            <div class="ml__grid">
              <div class="ml__field">
                <span class="ml__field-label">目的</span>
                <p>{{ m.purpose }}</p>
              </div>
              <div v-if="m.scope" class="ml__field">
                <span class="ml__field-label">适用范围</span>
                <p>{{ m.scope }}</p>
              </div>
              <div v-if="m.methods.length" class="ml__field">
                <span class="ml__field-label">方法/算法</span>
                <div class="ml__tags"><span v-for="mt in m.methods" :key="mt" class="wd-tag">{{ mt }}</span></div>
              </div>
              <div v-if="m.inputs.length" class="ml__field">
                <span class="ml__field-label">输入</span>
                <div class="ml__tags"><span v-for="inp in m.inputs" :key="inp" class="wd-tag">{{ inp }}</span></div>
              </div>
              <div v-if="m.outputs.length" class="ml__field">
                <span class="ml__field-label">输出</span>
                <div class="ml__tags"><span v-for="out in m.outputs" :key="out" class="wd-tag">{{ out }}</span></div>
              </div>
              <div class="ml__field ml__field--annotate">
                <span class="ml__field-label">对此模型的意见</span>
                <AnnotateButton :feature="`模型库·${m.name}`" chapter-id="model-library" chapter-title="模型库" />
              </div>
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

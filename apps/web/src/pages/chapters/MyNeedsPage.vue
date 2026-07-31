<script setup lang="ts">
import { useAnnotatorStore, type AnnotationType } from '@/stores/annotator'
import PageHeader from '@/components/PageHeader.vue'
import Panel from '@/components/Panel.vue'

const store = useAnnotatorStore()

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN', { hour12: false })
}
</script>

<template>
  <div class="cp">
    <PageHeader title="我的需求" subtitle="业主反馈汇总 · 可一键导出为需求变更清单（会议纪要级交付物）">
      <template #actions>
        <button class="mn__export" :disabled="!store.count" @click="store.download('json')">导出 JSON</button>
        <button class="mn__export mn__export--primary" :disabled="!store.count" @click="store.download('markdown')">导出 Markdown</button>
        <button class="mn__clear" :disabled="!store.count" @click="store.clear">清空</button>
      </template>
    </PageHeader>

    <!-- Summary tiles -->
    <div class="mn__stats">
      <div class="mn__stat wd-panel">
        <div class="mn__stat-num">{{ store.count }}</div>
        <div class="mn__stat-label">反馈总数</div>
      </div>
      <div v-for="(meta, key) in store.TYPE_META" :key="key" class="mn__stat wd-panel">
        <div class="mn__stat-num" :style="{ color: meta.color }">
          {{ meta.icon }} {{ store.countByType[key as AnnotationType] }}
        </div>
        <div class="mn__stat-label">{{ meta.label }}</div>
      </div>
    </div>

    <Panel v-if="store.count" title="反馈清单（按章节分组）" class="cp__block">
      <div v-for="a in store.items" :key="a.id" class="mn__item">
        <span class="mn__type" :style="{ color: store.TYPE_META[a.type].color }">
          {{ store.TYPE_META[a.type].icon }} {{ store.TYPE_META[a.type].label }}
        </span>
        <div class="mn__body">
          <div class="mn__feature">{{ a.feature }}</div>
          <div class="mn__text">{{ a.text }}</div>
          <div class="mn__meta">
            <span class="wd-tag">{{ a.chapterTitle }}</span>
            <span class="wd-ref">{{ fmtDate(a.createdAt) }}</span>
          </div>
        </div>
        <button class="mn__del" @click="store.remove(a.id)">删除</button>
      </div>
    </Panel>

    <Panel v-else title="暂无反馈" class="cp__block">
      <div class="mn__empty">
        <div class="mn__empty-icon">💬</div>
        <p>您还没有留下任何反馈。</p>
        <p class="mn__empty-hint">浏览各业务模块时，将鼠标移到任意功能行，点击 <strong>✏️ 批注按钮</strong> 即可记录"需要 / 修改 / 不要 / 提问"四类意见。</p>
        <router-link to="/overview" class="mn__cta">前往总览大屏 →</router-link>
      </div>
    </Panel>
  </div>
</template>

<style scoped>
@import '@/styles/_chapter.css';

.mn__export,
.mn__clear {
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid rgba(127, 168, 208, 0.25);
  background: rgba(6, 21, 40, 0.5);
  color: var(--wd-text-dim);
  transition: all 0.18s;
}
.mn__export--primary {
  background: var(--wd-gradient);
  border: none;
  color: #fff;
}
.mn__export:hover:not(:disabled),
.mn__clear:hover:not(:disabled) {
  color: var(--wd-primary);
  border-color: var(--wd-primary);
}
.mn__export--primary:hover:not(:disabled) {
  color: #fff;
  box-shadow: 0 6px 18px rgba(0, 102, 255, 0.4);
}
.mn__export:disabled,
.mn__clear:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.mn__clear:hover:not(:disabled) {
  color: var(--wd-danger);
  border-color: var(--wd-danger);
}

.mn__stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 4px;
}
@media (max-width: 900px) {
  .mn__stats { grid-template-columns: repeat(2, 1fr); }
}
.mn__stat {
  padding: 16px;
  text-align: center;
}
.mn__stat-num {
  font-size: 24px;
  font-weight: 700;
  font-family: var(--wd-font-mono);
  color: var(--wd-primary);
}
.mn__stat-label {
  font-size: 12px;
  color: var(--wd-text-dim);
  margin-top: 4px;
}

.mn__item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  transition: background 0.15s;
}
.mn__item:hover {
  background: rgba(0, 212, 255, 0.03);
}
.mn__type {
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 600;
  padding-top: 2px;
  width: 70px;
}
.mn__body {
  flex: 1;
  min-width: 0;
}
.mn__feature {
  font-size: 13px;
  font-weight: 600;
  color: var(--wd-text);
}
.mn__text {
  font-size: 13px;
  color: var(--wd-text-dim);
  margin: 4px 0 6px;
  line-height: 1.6;
}
.mn__meta {
  display: flex;
  gap: 8px;
  align-items: center;
}
.mn__del {
  background: none;
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 5px;
  color: var(--wd-text-dim);
  font-size: 11px;
  padding: 4px 8px;
  transition: all 0.18s;
}
.mn__del:hover {
  color: var(--wd-danger);
  border-color: var(--wd-danger);
}

.mn__empty {
  text-align: center;
  padding: 30px;
}
.mn__empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.mn__empty p {
  margin: 4px 0;
  color: var(--wd-text-dim);
  font-size: 13px;
}
.mn__empty-hint {
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.8;
}
.mn__empty strong {
  color: var(--wd-primary);
}
.mn__cta {
  display: inline-block;
  margin-top: 14px;
  padding: 8px 20px;
  border-radius: 6px;
  background: var(--wd-gradient);
  color: #fff;
  font-size: 13px;
}
</style>

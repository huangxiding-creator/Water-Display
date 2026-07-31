<script setup lang="ts">
/**
 * Displays a real report figure (reused from the source 初步设计报告).
 * If the image file is absent (e.g. open-source build without report IP),
 * shows a stylised SVG placeholder appropriate to the figure type — so the
 * layout never looks broken. This realises the user's explicit intent:
 * "报告里的图片、截图、设计图，能用到平台里".
 */
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    caption: string
    refTag?: string
    type?: 'map' | 'layout' | 'org' | 'framework' | 'generic'
  }>(),
  { type: 'generic' },
)

const failed = ref(false)
const placeholderTitle = computed(() => {
  const m: Record<string, string> = {
    map: '工程位置示意图',
    layout: '工程布局图',
    org: '管理机构设置图',
    framework: '总体框架图',
    generic: '报告附图',
  }
  return m[props.type] ?? '报告附图'
})
</script>

<template>
  <figure class="fig">
    <div class="fig__media">
      <img v-if="!failed" :src="src" :alt="caption" class="fig__img" @error="failed = true" />
      <!-- stylised fallback (shown when the real report PNG is absent) -->
      <div v-else class="fig__placeholder">
        <svg class="fig__ph-svg" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient :id="`fg-${type}`" x1="0" y1="0" x2="400" y2="260" gradientUnits="userSpaceOnUse">
              <stop stop-color="#0E2A52" /><stop offset="1" stop-color="#061528" />
            </linearGradient>
          </defs>
          <rect width="400" height="260" :fill="`url(#fg-${type})`" />
          <g stroke="#00D4FF" stroke-opacity="0.25" stroke-width="1">
            <path d="M0 60 H400 M0 130 H400 M0 200 H400 M80 0 V260 M200 0 V260 M320 0 V260" />
          </g>
          <!-- type-specific motif -->
          <g v-if="type === 'map' || type === 'layout'" fill="none" stroke="#00D4FF" stroke-width="1.6">
            <path d="M60 200 Q120 120 200 150 T360 90" />
            <circle cx="110" cy="170" r="4" fill="#FFB100" stroke="none" />
            <circle cx="200" cy="150" r="4" fill="#FFB100" stroke="none" />
            <circle cx="300" cy="115" r="4" fill="#FFB100" stroke="none" />
            <circle cx="360" cy="90" r="4" fill="#FFB100" stroke="none" />
          </g>
          <g v-else-if="type === 'org'" fill="none" stroke="#00D4FF" stroke-width="1.4">
            <rect x="160" y="40" width="80" height="28" rx="4" />
            <rect x="60" y="120" width="80" height="28" rx="4" />
            <rect x="160" y="120" width="80" height="28" rx="4" />
            <rect x="260" y="120" width="80" height="28" rx="4" />
            <path d="M200 68 V100 H100 V120 M200 100 V120 M200 100 H300 V120" />
          </g>
          <g v-else-if="type === 'framework'" fill="none" stroke="#00D4FF" stroke-width="1.4">
            <rect x="80" y="50" width="240" height="34" rx="4" />
            <rect x="80" y="110" width="240" height="34" rx="4" />
            <rect x="80" y="170" width="240" height="34" rx="4" />
            <path d="M200 84 V110 M200 144 V170" />
          </g>
          <g v-else fill="none" stroke="#00D4FF" stroke-width="1.4">
            <rect x="100" y="90" width="200" height="80" rx="6" />
          </g>
        </svg>
        <div class="fig__ph-note">📷 {{ placeholderTitle }}（占位）</div>
        <div class="fig__ph-hint">将报告原图置于 <code>public/figures/</code> 即自动替换</div>
      </div>
    </div>
    <figcaption class="fig__caption">
      <span>{{ caption }}</span>
      <span v-if="refTag" class="wd-ref">报告 {{ refTag }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.fig {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.fig__media {
  background: rgba(6, 21, 40, 0.5);
  border: 1px solid rgba(0, 212, 255, 0.18);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
}
.fig__img {
  max-width: 100%;
  max-height: 520px;
  object-fit: contain;
  display: block;
}
.fig__placeholder {
  position: relative;
  width: 100%;
  max-width: 560px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.fig__ph-svg {
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid rgba(0, 212, 255, 0.2);
}
.fig__ph-note {
  font-size: 13px;
  color: var(--wd-text);
  font-weight: 600;
}
.fig__ph-hint {
  font-size: 11px;
  color: var(--wd-text-dim);
}
.fig__ph-hint code {
  font-family: var(--wd-font-mono);
  color: var(--wd-primary);
}
.fig__caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  color: var(--wd-text-dim);
  padding: 0 4px;
}
</style>

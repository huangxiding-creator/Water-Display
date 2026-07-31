<script setup lang="ts">
/**
 * Synthesises an SVG logo mark from the project's brand.logo.mark keyword.
 * No asset files needed — every project gets a consistent, branded mark.
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    mark?: 'wave' | 'drop' | 'canal' | 'reservoir' | 'river' | 'mountain' | 'custom'
    size?: number | string
  }>(),
  { mark: 'wave', size: 40 },
)

const dim = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <svg
    class="wd-logo"
    :width="dim"
    :height="dim"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient :id="`g-${mark}`" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stop-color="var(--wd-primary)" />
        <stop offset="1" stop-color="var(--wd-primary-deep)" />
      </linearGradient>
    </defs>

    <!-- Rounded hex shield base -->
    <path
      d="M24 2 42 12 V36 L24 46 6 36 V12 Z"
      :stroke="`url(#g-${mark})`"
      stroke-width="1.5"
      fill="rgba(0,212,255,0.06)"
    />

    <!-- Mark variants -->
    <g v-if="mark === 'wave' || mark === 'river'">
      <path d="M12 20 Q18 14 24 20 T36 20" stroke="var(--wd-primary)" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <path d="M12 27 Q18 21 24 27 T36 27" stroke="var(--wd-primary)" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.7" />
      <path d="M12 34 Q18 28 24 34 T36 34" stroke="var(--wd-primary)" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.4" />
    </g>

    <g v-else-if="mark === 'drop' || mark === 'reservoir'">
      <path d="M24 10 C16 22 14 28 14 32 A10 10 0 0 0 34 32 C34 28 32 22 24 10 Z" :fill="`url(#g-${mark})`" opacity="0.85" />
      <circle cx="20" cy="30" r="2.5" fill="var(--wd-bg)" opacity="0.6" />
    </g>

    <g v-else-if="mark === 'canal'">
      <!-- Canal: two banks + flowing water + gate -->
      <path d="M10 18 H38" stroke="var(--wd-primary)" stroke-width="2" stroke-linecap="round" />
      <path d="M10 30 H38" stroke="var(--wd-primary)" stroke-width="2" stroke-linecap="round" />
      <path d="M14 22 Q20 19 26 22 T38 22" stroke="var(--wd-primary)" stroke-width="1.8" fill="none" opacity="0.7" />
      <path d="M14 26 Q20 23 26 26 T38 26" stroke="var(--wd-primary)" stroke-width="1.8" fill="none" opacity="0.7" />
      <rect x="22" y="13" width="4" height="9" rx="1" fill="var(--wd-accent)" />
    </g>

    <g v-else-if="mark === 'mountain'">
      <path d="M10 34 L20 18 L26 26 L30 20 L38 34 Z" :fill="`url(#g-${mark})`" opacity="0.8" />
      <path d="M12 34 Q20 28 28 32 T38 34" stroke="var(--wd-primary)" stroke-width="2" fill="none" />
    </g>
  </svg>
</template>

<style scoped>
.wd-logo {
  flex-shrink: 0;
  filter: drop-shadow(0 0 6px rgba(0, 212, 255, 0.4));
}
</style>

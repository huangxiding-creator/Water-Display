<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  unit?: string
  icon?: string
}>()
</script>

<template>
  <div class="kpi wd-panel wd-fade-in">
    <div class="kpi__glow" />
    <div class="kpi__body">
      <div class="kpi__value">
        <span class="kpi__num">{{ value }}</span>
        <span v-if="unit" class="kpi__unit">{{ unit }}</span>
      </div>
      <div class="kpi__label">{{ label }}</div>
    </div>
    <div class="kpi__icon">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.kpi {
  position: relative;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}
.kpi__glow {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.18), transparent 70%);
  pointer-events: none;
}
.kpi__body {
  position: relative;
}
.kpi__value {
  display: flex;
  align-items: baseline;
  gap: 6px;
}
.kpi__num {
  font-size: 30px;
  font-weight: 700;
  font-family: var(--wd-font-mono);
  color: var(--wd-primary);
  line-height: 1;
  text-shadow: 0 0 12px rgba(0, 212, 255, 0.4);
}
.kpi__unit {
  font-size: 13px;
  color: var(--wd-text-dim);
}
.kpi__label {
  margin-top: 6px;
  font-size: 13px;
  color: var(--wd-text-dim);
}
.kpi__icon {
  color: var(--wd-primary);
  opacity: 0.4;
}
</style>

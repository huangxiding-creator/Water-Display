<script setup lang="ts">
defineProps<{
  title: string
  refTag?: string
  subtitle?: string
}>()
</script>

<template>
  <header class="ph">
    <div class="ph__left">
      <h1 class="ph__title">{{ title }}</h1>
      <p v-if="subtitle" class="ph__subtitle">{{ subtitle }}</p>
    </div>
    <div class="ph__right">
      <span v-if="refTag" class="ph__ref wd-chip wd-chip--accent">报告 {{ refTag }}</span>
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.ph {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.12);
  position: relative;
}
.ph::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 80px;
  height: 2px;
  background: var(--wd-gradient);
}
.ph__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--wd-text);
  letter-spacing: 1px;
}
.ph__subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--wd-text-dim);
}
.ph__right {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

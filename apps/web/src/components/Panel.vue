<script setup lang="ts">
/** Standard tech-dashboard panel with title bar and optional ref tag. */
defineProps<{
  title?: string
  refTag?: string
  /** Fill available height (for charts). */
  fill?: boolean
}>()
</script>

<template>
  <section class="wd-panel panel" :class="{ 'panel--fill': fill }">
    <header v-if="title || $slots.title || refTag" class="wd-panel-title title">
      <slot name="title">
        <span>{{ title }}</span>
      </slot>
      <span v-if="refTag" class="wd-ref" style="margin-left: auto">{{ refTag }}</span>
      <slot name="actions" />
    </header>
    <div class="body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.panel--fill {
  flex: 1;
}
.title {
  flex-shrink: 0;
}
.body {
  padding: 16px;
  flex: 1;
  min-height: 0;
  overflow: auto;
}
</style>

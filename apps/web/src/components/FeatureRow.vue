<script setup lang="ts">
/** A feature/requirement row with an inline annotation trigger. */
import AnnotateButton from './AnnotateButton.vue'

defineProps<{
  name: string
  desc?: string
  chapterId?: string
  chapterTitle?: string
}>()
</script>

<template>
  <div class="fr">
    <div class="fr__main">
      <span class="fr__name">{{ name }}</span>
      <span v-if="desc" class="fr__desc">{{ desc }}</span>
    </div>
    <AnnotateButton :feature="name" :chapter-id="chapterId" :chapter-title="chapterTitle" />
  </div>
</template>

<style scoped>
.fr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.15s;
}
.fr:hover {
  background: rgba(0, 212, 255, 0.04);
}
.fr__main {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex: 1;
  min-width: 0;
}
.fr__name {
  font-size: 13px;
  color: var(--wd-text);
  white-space: nowrap;
}
.fr__desc {
  font-size: 12px;
  color: var(--wd-text-dim);
}
</style>

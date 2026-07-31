<script setup lang="ts">
/**
 * Inline requirement-annotation trigger. Mounts on any feature row;
 * opens a small popover to capture owner feedback (want/drop/modify/ask).
 * This is the "100×" interaction that turns a display site into a
 * requirement-alignment tool.
 */
import { ref } from 'vue'
import { useAnnotatorStore, type AnnotationType } from '@/stores/annotator'
import { useRoute } from 'vue-router'

const props = defineProps<{
  feature: string
  chapterId?: string
  chapterTitle?: string
}>()

const store = useAnnotatorStore()
const route = useRoute()
const open = ref(false)
const type = ref<AnnotationType>('want')
const text = ref('')

const types: Array<{ key: AnnotationType; label: string; icon: string }> = [
  { key: 'want', label: '需要', icon: '✅' },
  { key: 'modify', label: '修改', icon: '✏️' },
  { key: 'drop', label: '不要', icon: '❌' },
  { key: 'ask', label: '提问', icon: '❓' },
]

function submit() {
  if (!text.value.trim()) return
  store.add({
    chapterId: props.chapterId ?? String(route.name),
    chapterTitle: props.chapterTitle ?? String(route.meta.title ?? route.name),
    feature: props.feature,
    type: type.value,
    text: text.value.trim(),
  })
  text.value = ''
  open.value = false
}
</script>

<template>
  <div class="ann">
    <button class="ann__btn" :class="{ 'ann__btn--active': open }" @click="open = !open" :aria-label="`批注：${feature}`">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <transition name="ann-pop">
      <div v-if="open" class="ann__popover" @click.stop>
        <div class="ann__types">
          <button
            v-for="t in types"
            :key="t.key"
            class="ann__type"
            :class="{ 'ann__type--active': type === t.key }"
            @click="type = t.key"
          >
            <span>{{ t.icon }}</span>{{ t.label }}
          </button>
        </div>
        <textarea
          v-model="text"
          class="ann__text"
          :placeholder="`对「${feature}」的意见…`"
          rows="2"
          @keydown.meta.enter="submit"
          @keydown.ctrl.enter="submit"
        />
        <div class="ann__foot">
          <button class="ann__cancel" @click="open = false">取消</button>
          <button class="ann__submit" :disabled="!text.trim()" @click="submit">提交反馈</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.ann {
  position: relative;
  display: inline-flex;
}
.ann__btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 5px;
  color: var(--wd-text-dim);
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.18s;
}
.ann__btn--active,
*:hover > .ann__btn {
  opacity: 1;
}
.ann__btn:hover,
.ann__btn--active {
  color: var(--wd-primary);
  border-color: rgba(0, 212, 255, 0.3);
  background: rgba(0, 212, 255, 0.08);
}
.ann__popover {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 50;
  width: 280px;
  padding: 12px;
  background: linear-gradient(160deg, rgba(11, 34, 71, 0.98), rgba(6, 21, 40, 0.98));
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 10px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
}
.ann__types {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 8px;
}
.ann__type {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  font-size: 12px;
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 6px;
  background: rgba(6, 21, 40, 0.5);
  color: var(--wd-text-dim);
  transition: all 0.15s;
}
.ann__type--active {
  border-color: var(--wd-primary);
  color: var(--wd-primary);
  background: rgba(0, 212, 255, 0.1);
}
.ann__text {
  width: 100%;
  padding: 8px;
  background: rgba(6, 21, 40, 0.6);
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 6px;
  color: var(--wd-text);
  font-family: inherit;
  font-size: 13px;
  resize: none;
  outline: none;
}
.ann__text:focus {
  border-color: var(--wd-primary);
}
.ann__foot {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 8px;
}
.ann__cancel {
  background: none;
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 5px;
  color: var(--wd-text-dim);
  font-size: 12px;
  padding: 5px 10px;
}
.ann__submit {
  background: var(--wd-gradient);
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 12px;
  padding: 5px 10px;
}
.ann__submit:disabled {
  opacity: 0.4;
}
.ann-pop-enter-active,
.ann-pop-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}
.ann-pop-enter-from,
.ann-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

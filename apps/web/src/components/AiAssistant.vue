<script setup lang="ts">
/**
 * Floating AI assistant — bottom-right chat panel powered by Zhipu GLM.
 * Answers owner questions about THIS project's informatization requirements.
 * Available on every page; carries the current chapter as context.
 */
import { ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAi, type ChatMessage } from '@/composables/useAi'
import { buildReportContext, SUGGESTED_QUESTIONS } from '@/data/reportContext'
import { navIndex } from '@/data/project'

const route = useRoute()
const ai = useAi()

const open = ref(false)
const settingsOpen = ref(false)
const input = ref('')
const busy = ref(false)
const keyInput = ref(ai.apiKey.value)
const modelInput = ref(ai.model.value)
const scrollRef = ref<HTMLDivElement | null>(null)

interface UiMsg {
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}
const messages = ref<UiMsg[]>([])

function currentChapter(): string | undefined {
  const item = navIndex.get(String(route.name))
  return item?.title
}

async function send(text?: string) {
  const content = (text ?? input.value).trim()
  if (!content || busy.value) return
  if (!ai.configured.value) {
    settingsOpen.value = true
    return
  }
  input.value = ''
  messages.value = [...messages.value, { role: 'user', content }]
  busy.value = true
  await nextTick()
  scrollToBottom()

  const history: ChatMessage[] = [
    { role: 'system', content: buildReportContext(currentChapter()) },
    ...messages.value
      .filter((m) => !m.error)
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }) as ChatMessage),
  ]

  // Add an empty assistant bubble and stream into it
  const idx = messages.value.push({ role: 'assistant', content: '' }) - 1
  try {
    for await (const chunk of ai.stream(history)) {
      messages.value[idx] = { ...messages.value[idx], content: messages.value[idx].content + chunk }
      scrollToBottom()
    }
    if (!messages.value[idx].content) {
      messages.value[idx] = { role: 'assistant', content: '（模型未返回内容，请重试）', error: true }
    }
  } catch (e) {
    messages.value[idx] = {
      role: 'assistant',
      content: `⚠️ ${(e as Error).message}`,
      error: true,
    }
  } finally {
    busy.value = false
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  })
}

function saveSettings() {
  ai.setKey(keyInput.value.trim())
  ai.setModel(modelInput.value)
  settingsOpen.value = false
}

function clearChat() {
  messages.value = []
}
</script>

<template>
  <!-- Floating button -->
  <button class="ai-fab" :class="{ 'ai-fab--open': open }" @click="open = !open" aria-label="AI 报告问答助手">
    <span v-if="!open" class="ai-fab__icon">🤖</span>
    <span v-else class="ai-fab__close">✕</span>
    <span v-if="!open" class="ai-fab__pulse" />
  </button>

  <!-- Panel -->
  <transition name="ai-panel">
    <section v-if="open" class="ai-panel">
      <header class="ai-panel__head">
        <div class="ai-panel__title">
          <span class="ai-panel__avatar">🤖</span>
          <div>
            <div class="ai-panel__name">AI 报告问答助手</div>
            <div class="ai-panel__model">
              {{ ai.configured.value ? `GLM · ${ai.model.value}` : '未配置' }}
            </div>
          </div>
        </div>
        <div class="ai-panel__actions">
          <button class="ai-panel__btn" title="设置" @click="settingsOpen = !settingsOpen">⚙</button>
          <button class="ai-panel__btn" title="清空" @click="clearChat">🗑</button>
        </div>
      </header>

      <!-- Settings -->
      <div v-if="settingsOpen" class="ai-settings">
        <label class="ai-settings__field">
          <span>智谱 API Key</span>
          <input v-model="keyInput" type="password" placeholder="粘贴智谱 API Key（仅存本地）" />
        </label>
        <label class="ai-settings__field">
          <span>模型</span>
          <select v-model="modelInput">
            <option value="glm-4.5-flash">glm-4.5-flash（免费，推荐）</option>
            <option value="glm-5.2">glm-5.2（收费，更强）</option>
          </select>
        </label>
        <button class="ai-settings__save" @click="saveSettings">保存</button>
        <p class="ai-settings__hint">Key 仅存于本机 localStorage，不会上传。免费申请：bigmodel.cn</p>
      </div>

      <!-- Messages -->
      <div ref="scrollRef" class="ai-panel__body">
        <div v-if="!messages.length" class="ai-empty">
          <div class="ai-empty__icon">💬</div>
          <p class="ai-empty__title">问我任何关于「江巷灌区数字孪生」的问题</p>
          <div class="ai-empty__suggestions">
            <button v-for="q in SUGGESTED_QUESTIONS" :key="q" class="ai-suggest" @click="send(q)">
              {{ q }}
            </button>
          </div>
        </div>

        <div
          v-for="(m, i) in messages"
          :key="i"
          class="ai-msg"
          :class="[`ai-msg--${m.role}`, { 'ai-msg--error': m.error }]"
        >
          <div class="ai-msg__bubble">
            <span v-if="m.role === 'assistant'" class="ai-msg__pre">{{ m.content || '思考中…' }}</span>
            <span v-else>{{ m.content }}</span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <form class="ai-panel__input" @submit.prevent="send()">
        <input
          v-model="input"
          :disabled="busy"
          placeholder="输入问题，Enter 发送…"
          @keydown.enter.prevent="send()"
        />
        <button type="submit" :disabled="busy || !input.trim()" class="ai-panel__send">
          {{ busy ? '…' : '发送' }}
        </button>
      </form>
    </section>
  </transition>
</template>

<style scoped>
.ai-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 200;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--wd-gradient);
  color: #fff;
  font-size: 24px;
  box-shadow: 0 8px 28px rgba(0, 102, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}
.ai-fab:hover {
  transform: scale(1.06);
}
.ai-fab__close {
  font-size: 20px;
}
.ai-fab__pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--wd-primary);
  animation: ai-ring 2s ease-out infinite;
}
@keyframes ai-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.5); opacity: 0; }
}

.ai-panel {
  position: fixed;
  right: 24px;
  bottom: 92px;
  z-index: 201;
  width: 400px;
  max-width: calc(100vw - 48px);
  height: 560px;
  max-height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, rgba(11, 34, 71, 0.97), rgba(6, 21, 40, 0.97));
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  overflow: hidden;
}

.ai-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);
  flex-shrink: 0;
}
.ai-panel__title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ai-panel__avatar {
  font-size: 22px;
}
.ai-panel__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--wd-text);
}
.ai-panel__model {
  font-size: 11px;
  color: var(--wd-text-dim);
}
.ai-panel__actions {
  display: flex;
  gap: 4px;
}
.ai-panel__btn {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 6px;
  background: none;
  color: var(--wd-text-dim);
  font-size: 13px;
}
.ai-panel__btn:hover {
  color: var(--wd-primary);
  border-color: var(--wd-primary);
}

.ai-settings {
  padding: 12px 16px;
  background: rgba(0, 212, 255, 0.04);
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}
.ai-settings__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: var(--wd-text-dim);
}
.ai-settings__field input,
.ai-settings__field select {
  padding: 6px 8px;
  background: rgba(6, 21, 40, 0.6);
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 5px;
  color: var(--wd-text);
  font-size: 12px;
  font-family: inherit;
}
.ai-settings__save {
  padding: 7px;
  background: var(--wd-gradient);
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
}
.ai-settings__hint {
  margin: 0;
  font-size: 10px;
  color: var(--wd-text-dim);
  opacity: 0.7;
  line-height: 1.5;
}

.ai-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-empty {
  text-align: center;
  margin-top: 30px;
}
.ai-empty__icon {
  font-size: 36px;
}
.ai-empty__title {
  font-size: 13px;
  color: var(--wd-text-dim);
  margin: 8px 0 16px;
}
.ai-empty__suggestions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ai-suggest {
  padding: 8px 12px;
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 8px;
  color: var(--wd-text);
  font-size: 12px;
  text-align: left;
  transition: all 0.15s;
}
.ai-suggest:hover {
  background: rgba(0, 212, 255, 0.12);
  border-color: var(--wd-primary);
}

.ai-msg {
  display: flex;
}
.ai-msg--user {
  justify-content: flex-end;
}
.ai-msg__bubble {
  max-width: 85%;
  padding: 9px 12px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.7;
}
.ai-msg--user .ai-msg__bubble {
  background: var(--wd-gradient);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.ai-msg--assistant .ai-msg__bubble {
  background: rgba(0, 212, 255, 0.06);
  border: 1px solid rgba(0, 212, 255, 0.15);
  color: var(--wd-text);
  border-bottom-left-radius: 4px;
}
.ai-msg--error .ai-msg__bubble {
  border-color: var(--wd-danger);
  color: var(--wd-danger);
}
.ai-msg__pre {
  white-space: pre-wrap;
  word-break: break-word;
}

.ai-panel__input {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid rgba(0, 212, 255, 0.15);
  flex-shrink: 0;
}
.ai-panel__input input {
  flex: 1;
  padding: 9px 12px;
  background: rgba(6, 21, 40, 0.6);
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 8px;
  color: var(--wd-text);
  font-size: 13px;
  font-family: inherit;
  outline: none;
}
.ai-panel__input input:focus {
  border-color: var(--wd-primary);
}
.ai-panel__send {
  padding: 0 16px;
  background: var(--wd-gradient);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}
.ai-panel__send:disabled {
  opacity: 0.4;
}

.ai-panel-enter-active,
.ai-panel-leave-active {
  transition: opacity 0.2s, transform 0.2s;
  transform-origin: bottom right;
}
.ai-panel-enter-from,
.ai-panel-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(10px);
}
</style>

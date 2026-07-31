/**
 * AI assistant composable — answers owner questions using the Zhipu BigModel API
 * (GLM-4.5-Flash by default, free; GLM-5.2 for harder questions).
 *
 * Security model:
 *  - Key resolved from: localStorage (user-entered) → import.meta.env (build-time)
 *  - NEVER baked into the shipped artifact by default; the public build reads
 *    from the in-app settings panel so the key stays with the operator.
 *  - Model defaults to GLM-4.5-Flash (free); upgrades to GLM-5.2 only when paid.
 */
import { ref } from 'vue'

const LS_KEY = 'wd-zhipu-key'
const LS_MODEL = 'wd-zhipu-model'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

function readKey(): string {
  return localStorage.getItem(LS_KEY) || (import.meta.env.VITE_ZHIPU_API_KEY as string) || ''
}
function readModel(): string {
  return (
    localStorage.getItem(LS_MODEL) ||
    (import.meta.env.VITE_ZHIPU_MODEL as string) ||
    'glm-4.5-flash'
  )
}
function readEndpoint(): string {
  return (
    (import.meta.env.VITE_ZHIPU_ENDPOINT as string) ||
    'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  )
}

export function useAi() {
  const apiKey = ref(readKey())
  const model = ref(readModel())
  const configured = ref(apiKey.value.length > 0)

  function setKey(key: string) {
    apiKey.value = key
    localStorage.setItem(LS_KEY, key)
    configured.value = key.length > 0
  }
  function setModel(m: string) {
    model.value = m
    localStorage.setItem(LS_MODEL, m)
  }

  /** Streaming chat completion. Yields incremental text chunks. */
  async function* stream(messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<string> {
    if (!apiKey.value) throw new Error('未配置 API Key，请先在「AI 设置」中填写。')
    const res = await fetch(readEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.value}`,
      },
      body: JSON.stringify({ model: model.value, messages, stream: true, temperature: 0.3 }),
      signal,
    })
    if (!res.ok || !res.body) {
      const txt = await res.text().catch(() => res.statusText)
      throw new Error(`API 请求失败 (${res.status}): ${txt.slice(0, 200)}`)
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buf = ''
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const lines = buf.split('\n')
      buf = lines.pop() ?? ''
      for (const line of lines) {
        const t = line.trim()
        if (!t.startsWith('data:')) continue
        const payload = t.slice(5).trim()
        if (payload === '[DONE]') return
        try {
          const json = JSON.parse(payload)
          const delta = json?.choices?.[0]?.delta?.content ?? ''
          if (delta) yield delta as string
        } catch {
          /* ignore malformed keepalive lines */
        }
      }
    }
  }

  /** Non-streaming one-shot (used when stream not needed). */
  async function ask(messages: ChatMessage[], signal?: AbortSignal): Promise<string> {
    let out = ''
    for await (const chunk of stream(messages, signal)) out += chunk
    return out
  }

  return { apiKey, model, configured, setKey, setModel, stream, ask }
}

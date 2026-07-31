/**
 * Requirement annotator store — the "100×" differentiator.
 *
 * Owners browse the showcase and leave structured feedback on any feature:
 *   - ✅ want  (要)        — confirm a requirement
 *   - ❌ drop  (不要)      — remove a requirement
 *   - ✏️ modify (修改)     — change a requirement
 *   - ❓ ask   (提问)      — ask a question
 *
 * Annotations persist to localStorage and export to a structured change-list
 * (JSON + Markdown) that becomes the meeting deliverable.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type AnnotationType = 'want' | 'drop' | 'modify' | 'ask'

export interface Annotation {
  id: string
  chapterId: string
  chapterTitle: string
  feature: string
  type: AnnotationType
  text: string
  author?: string
  createdAt: number
}

const STORAGE_KEY = 'wd-annotations-v1'

const TYPE_META: Record<AnnotationType, { label: string; icon: string; color: string }> = {
  want: { label: '需要', icon: '✅', color: 'var(--wd-success)' },
  drop: { label: '不要', icon: '❌', color: 'var(--wd-danger)' },
  modify: { label: '修改', icon: '✏️', color: 'var(--wd-warning)' },
  ask: { label: '提问', icon: '❓', color: 'var(--wd-primary)' },
}

function load(): Annotation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Annotation[]) : []
  } catch {
    return []
  }
}

export const useAnnotatorStore = defineStore('annotator', () => {
  const items = ref<Annotation[]>(load())

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  function add(input: Omit<Annotation, 'id' | 'createdAt'>): Annotation {
    const annotation: Annotation = {
      ...input,
      id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
    }
    items.value = [...items.value, annotation]
    persist()
    return annotation
  }

  function remove(id: string) {
    items.value = items.value.filter((a) => a.id !== id)
    persist()
  }

  function update(id: string, patch: Partial<Annotation>) {
    items.value = items.value.map((a) => (a.id === id ? { ...a, ...patch } : a))
    persist()
  }

  function clear() {
    items.value = []
    persist()
  }

  function byChapter(chapterId: string): Annotation[] {
    return items.value.filter((a) => a.chapterId === chapterId)
  }

  const count = computed(() => items.value.length)
  const countByType = computed(() => {
    const counts: Record<AnnotationType, number> = { want: 0, drop: 0, modify: 0, ask: 0 }
    for (const a of items.value) counts[a.type] += 1
    return counts
  })

  /** Export as a structured JSON document — the meeting deliverable. */
  function exportJSON(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        total: items.value.length,
        annotations: items.value,
      },
      null,
      2,
    )
  }

  /** Export as Markdown for human review / meeting minutes. */
  function exportMarkdown(): string {
    const groups = new Map<string, Annotation[]>()
    for (const a of items.value) {
      const list = groups.get(a.chapterTitle) ?? []
      list.push(a)
      groups.set(a.chapterTitle, list)
    }
    const lines: string[] = [
      '# 业主需求反馈清单',
      '',
      `> 导出时间：${new Date().toLocaleString('zh-CN')}`,
      `> 反馈条数：${items.value.length}`,
      '',
    ]
    for (const [title, list] of groups) {
      lines.push(`## ${title}`, '')
      for (const a of list) {
        const meta = TYPE_META[a.type]
        lines.push(`- ${meta.icon} **[${meta.label}]** ${a.feature} — ${a.text}`)
      }
      lines.push('')
    }
    return lines.join('\n')
  }

  function download(format: 'json' | 'markdown') {
    const content = format === 'json' ? exportJSON() : exportMarkdown()
    const ext = format === 'json' ? 'json' : 'md'
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `需求反馈_${new Date().toISOString().slice(0, 10)}.${ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    items,
    TYPE_META,
    add,
    remove,
    update,
    clear,
    byChapter,
    count,
    countByType,
    exportJSON,
    exportMarkdown,
    download,
  }
})

/**
 * Builds the system-prompt knowledge context for the AI assistant from the
 * active ProjectConfig — a compact, structured digest that lets the model
 * answer owner questions about THIS project's informatization requirements
 * without needing the full 215-page report in every request.
 */
import { project } from './project'

export function buildReportContext(currentChapter?: string): string {
  const p = project
  const lines: string[] = [
    `你是「${p.brand.systemName}」的需求沟通助手。`,
    `该平台依据《${p.report?.title ?? ''}》${p.report?.chapter ?? ''} 构建，用于业主单位理解数字孪生建设需求。`,
    `请用专业、简洁的中文回答业主问题；基于以下已确认的建设需求作答；不确定时如实说明；避免编造未列出的内容。`,
    '',
    `# 工程概况`,
    `- 总面积 ${p.engineering.totalArea} km²，设计灌溉面积 ${p.engineering.designIrrigationArea} 万亩`,
    `- 主要工程：${p.engineering.highlights.join('；')}`,
    `- 建筑物：${p.engineering.entities.map((e) => `${e.name}${e.count}`).join('、')}`,
    '',
    `# 总体框架（${p.nav.length} 大章节）`,
    ...p.nav.map((n) => `- ${n.title}${n.ref ? `（报告 ${n.ref}）` : ''}`),
    '',
    `# 数字孪生平台`,
    `## 模型库（${p.twinPlatform.models.length} 类）`,
    ...p.twinPlatform.models.map((m) => `- ${m.name}：${m.purpose}${m.methods.length ? `；方法：${m.methods.join('、')}` : ''}`),
    `## 知识库（${p.twinPlatform.knowledgeBases.length} 大库）`,
    ...p.twinPlatform.knowledgeBases.map((k) => `- ${k.name}：${k.purpose}`),
    `## 数据底板`,
    ...p.twinPlatform.dataLevels.map((d) => `- ${d.level}：${d.precision}（${d.scope}）`),
    `数据类别：${p.twinPlatform.dataCategories.map((c) => `${c.name} ${c.count}`).join('、')}`,
    '',
    `# 信息化基础设施`,
    `- ${p.infrastructure.networkTopology}`,
    `- 感知：${p.infrastructure.sensors.map((s) => `${s.name} ${s.count}`).join('、')}`,
    `- 远控：${p.infrastructure.controlStations} 座直属泵站、${p.infrastructure.culverts} 处放水涵`,
    `- 运行环境：${p.infrastructure.servers.map((s) => `${s.name} ${s.count}`).join('、')}`,
    '',
    `# 业务应用（${p.businessModules.length} 模块）`,
    ...p.businessModules.map((m) => `- ${m.title}（${m.ref}）：${m.purpose}`),
    '',
    `# 性能与安全`,
    `- 并发 ${p.performance.concurrentUsers} 人，响应 ≤ ${p.performance.responseTimeSec}s`,
    `- 视频 ${p.performance.videoResolution}，存储 ${p.performance.videoRetentionDays} 天`,
    `- 安全：控制专网 ${p.security.controlLevel}、业务网 ${p.security.businessLevel}`,
    `- 措施：${p.security.measures.join('、')}`,
    '',
    `# 现状存在的问题`,
    ...p.problems.map((x, i) => `${i + 1}. ${x}`),
  ]

  if (currentChapter) {
    lines.push('', `# 当前业主正在浏览的章节：${currentChapter}`, `请优先结合该章节内容作答。`)
  }
  return lines.join('\n')
}

/** Suggested starter questions shown in the empty state. */
export const SUGGESTED_QUESTIONS = [
  '什么是 L1/L2/L3 数据底板？',
  '四预（预报预警预演预案）具体指什么？',
  '江巷灌区有哪些业务应用？',
  '等保三级需要哪些安全措施？',
  '灌区的感知网有多少个监测点？',
  '滁河一级站为什么要做数字孪生？',
]

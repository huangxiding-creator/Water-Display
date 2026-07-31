<script setup lang="ts">
/**
 * Mock knowledge-base browser — realises the user's intent:
 * "建一些模拟的知识库，然后给他放一些测试数据到里面".
 *
 * Renders the 8 KBs from config with browsable mock entries (test data) so
 * owners can see what each knowledge base actually contains. Pure mock; the
 * real platform would wire to a knowledge engine + vector store.
 */
import { ref, computed } from 'vue'
import { project } from '@/data/project'

interface KbEntry {
  title: string
  category: string
  date: string
  summary: string
  detail?: string
}

const MOCK: Record<string, KbEntry[]> = {
  k_plan: [
    { title: '江巷灌区抗旱应急预案（III级响应）', category: '抗旱预案', date: '2024-03', summary: '当蓄水量低于设计30%且持续20天，启动III级响应：优先城乡供水，压减农业用水20%。', detail: '启动条件：江巷水库蓄水量<0.9亿m³ 且 30日累计降雨<40mm。响应措施：①童王提水站满负荷向芝麻水库补水；②蔡桥/岗王联调；③启动应急水源联通工程。' },
    { title: '骨干泵站调度方案（丰水期）', category: '泵站调度', date: '2024-04', summary: '丰水期滁河一至四级站优化开机组合，避免弃水，兼顾排涝。' },
    { title: '骨干水利工程应急抢险预案（溃坝场景）', category: '抢险预案', date: '2024-01', summary: '江巷水库溃坝洪水演进、淹没范围、转移路线、物资储备点。' },
  ],
  k_rule: [
    { title: '灌溉调度规则 · 保证率≥80%', category: '灌溉规则', date: '常驻', summary: '联合灌片保证率<80% 时触发江巷水库补水；分片区按作物权重配水。' },
    { title: '生态补水规则 · 最小生态流量', category: '生态规则', date: '常驻', summary: '池河控制断面生态基流≥2.5m³/s，低于阈值自动调水。' },
    { title: '联合调度规则 · 江巷水库补水触发', category: '联调规则', date: '常驻', summary: '多水源联调：江巷水库、蔡桥水库、驷马山引江按优先序与成本最优分配。' },
  ],
  k_history: [
    { title: '2023年伏旱调度全过程', category: '旱情场景', date: '2023-07', summary: '7-8月伏旱，累计调水1.2亿m³，启动II级响应，农业损失降低37%。', detail: '气象：30日累计降雨28mm。决策：江庄提水站27m³/s满负荷运行42天。效果：城乡供水保证率100%，灌溉保证率78%。' },
    { title: '2022年汛期洪水调度', category: '洪水场景', date: '2022-07', summary: '7月中旬暴雨，江巷水库最高水位超汛限0.8m，预泄成功错峰。' },
    { title: '2024年春灌水资源配置', category: '配置场景', date: '2024-03', summary: '春灌期四片区配水，直供片优先，生态基流保障。' },
  ],
  k_dispatch: [
    { title: '2024年丰水年调度方案（P=25%）', category: '年方案', date: '2024-01', summary: '丰水年可供水量充足，重点排涝与弃水管理，发电效益最大化。' },
    { title: '2024年平水年调度方案（P=50%）', category: '年方案', date: '2024-01', summary: '基准方案，各分区按设计保证率配水。' },
    { title: '应急调度方案（特枯年 P=95%）', category: '应急方案', date: '2024-01', summary: '特枯年压减农业40%，启动全部补水措施，保城乡供水。' },
  ],
  k_expert: [
    { title: '专家经验 · 供水优先序', category: '决策经验', date: '积累', summary: '城乡供水 > 灌溉 > 生态 >发电的优先序，特枯年依次压减后序。' },
    { title: '专家经验 · 泵站高效区运行', category: '运行经验', date: '积累', summary: '机组宜在额定扬程±10%区间运行，偏离则调整开机台数而非叶片角度。' },
  ],
  k_safety: [
    { title: '风险隐患 · 泵站汽蚀识别与处置', category: '隐患研判', date: '常驻', summary: '汽蚀表征、成因、监测指标阈值、处置流程。', detail: '识别：振动增大、效率下降、噪声异常。成因：NPSH不足。处置：调整进水水位、更换叶轮。' },
    { title: '事故案例 · 某渡槽裂缝渗水处置', category: '事故案例', date: '案例库', summary: '工程类型：渡槽；事故类型：结构裂缝；因素：温差+地基沉降；处置：环氧灌浆+加强监测。' },
  ],
  k_policy: [
    { title: '《中华人民共和国水法》', category: '法律', date: '2016修正', summary: '水资源规划、开发、利用、保护、管理的基本法律。' },
    { title: '《中华人民共和国防洪法》', category: '法律', date: '2016修正', summary: '防洪规划、治理与防护、防洪区和防洪工程设施的管理。' },
    { title: '《数字孪生流域建设技术大纲（试行）》', category: '行业规范', date: '水利部2022', summary: '数字孪生流域建设目标、框架、数据底板/模型/知识平台技术要求。' },
  ],
  k_doc: [
    { title: '江巷灌区初设报告（双层PDF · OCR）', category: '设计文件', date: '2024', summary: '图文双层PDF，支持全文检索、复制；含工程信息化第15章。' },
    { title: '工程设计图纸集（PDF）', category: '图纸', date: '2024', summary: '渠道纵横断、泵站结构、电气一次二次图，已整编入库。' },
    { title: '工程验收文件汇编', category: '验收', date: '滚动', summary: '单位工程验收、档案整编进度跟踪。' },
  ],
}

const kbs = computed(() => project.twinPlatform.knowledgeBases)
const activeId = ref(kbs.value[0]?.id ?? '')
const activeKb = computed(() => kbs.value.find((k) => k.id === activeId.value))
const entries = computed<KbEntry[]>(() => MOCK[activeId.value] ?? [])
const query = ref('')
const filteredEntries = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return entries.value
  return entries.value.filter((e) => (e.title + e.summary + e.category).toLowerCase().includes(q))
})
const expandedEntry = ref<number | null>(0)
function toggleEntry(i: number) {
  expandedEntry.value = expandedEntry.value === i ? null : i
}
</script>

<template>
  <div class="kb">
    <!-- KB tabs -->
    <div class="kb__tabs">
      <button
        v-for="k in kbs"
        :key="k.id"
        class="kb__tab"
        :class="{ 'kb__tab--active': activeId === k.id }"
        @click="activeId = k.id; expandedEntry = 0"
      >
        <span class="kb__tab-name">{{ k.name }}</span>
        <span class="kb__tab-count">{{ (MOCK[k.id] ?? []).length }}</span>
      </button>
    </div>

    <!-- active KB -->
    <div class="kb__body">
      <div class="kb__head">
        <div>
          <h4 class="kb__title">{{ activeKb?.name }}</h4>
          <p class="kb__purpose">{{ activeKb?.purpose }}</p>
        </div>
        <input v-model="query" class="kb__search" placeholder="检索测试数据…" aria-label="检索知识库" />
      </div>

      <div class="kb__list">
        <div v-for="(e, i) in filteredEntries" :key="i" class="kb__entry" :class="{ 'kb__entry--open': expandedEntry === i }">
          <button class="kb__entry-head" @click="toggleEntry(i)">
            <span class="kb__entry-cat">{{ e.category }}</span>
            <span class="kb__entry-title">{{ e.title }}</span>
            <span class="kb__entry-date">{{ e.date }}</span>
            <span class="kb__entry-expand" :class="{ 'is-open': expandedEntry === i }">▾</span>
          </button>
          <transition name="kb-detail">
            <div v-if="expandedEntry === i" class="kb__entry-body">
              <p class="kb__entry-summary">{{ e.summary }}</p>
              <p v-if="e.detail" class="kb__entry-detail">{{ e.detail }}</p>
              <span class="kb__mock-tag">🧪 测试数据 · 仅用于演示</span>
            </div>
          </transition>
        </div>
        <div v-if="!filteredEntries.length" class="kb__empty">未匹配到条目</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kb {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.kb__tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.12);
}
.kb__tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: rgba(6, 21, 40, 0.5);
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 8px;
  color: var(--wd-text-dim);
  font-size: 12px;
  transition: all 0.18s;
}
.kb__tab:hover { color: var(--wd-text); border-color: rgba(0, 212, 255, 0.3); }
.kb__tab--active {
  color: var(--wd-primary);
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--wd-primary);
}
.kb__tab-count {
  font-family: var(--wd-font-mono);
  font-size: 10px;
  background: rgba(0, 212, 255, 0.15);
  padding: 1px 6px;
  border-radius: 999px;
}
.kb__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 10px;
}
.kb__title { margin: 0; font-size: 15px; color: var(--wd-primary); font-weight: 600; }
.kb__purpose { margin: 4px 0 0; font-size: 12px; color: var(--wd-text-dim); }
.kb__search {
  padding: 7px 12px;
  background: rgba(6, 21, 40, 0.6);
  border: 1px solid rgba(127, 168, 208, 0.2);
  border-radius: 8px;
  color: var(--wd-text);
  font-size: 12px;
  font-family: inherit;
  outline: none;
  min-width: 180px;
}
.kb__search:focus { border-color: var(--wd-primary); }
.kb__list { display: flex; flex-direction: column; gap: 6px; }
.kb__entry {
  background: rgba(0, 212, 255, 0.03);
  border: 1px solid rgba(127, 168, 208, 0.1);
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.18s;
}
.kb__entry--open { border-color: rgba(0, 212, 255, 0.35); }
.kb__entry-head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}
.kb__entry-cat {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0, 212, 255, 0.1);
  color: var(--wd-primary);
  flex-shrink: 0;
}
.kb__entry-title { flex: 1; font-size: 13px; color: var(--wd-text); }
.kb__entry-date { font-size: 11px; color: var(--wd-text-dim); font-family: var(--wd-font-mono); }
.kb__entry-expand { color: var(--wd-text-dim); transition: transform 0.2s; }
.kb__entry-expand.is-open { transform: rotate(180deg); }
.kb__entry-body {
  padding: 0 14px 14px;
  border-top: 1px solid rgba(0, 212, 255, 0.1);
}
.kb__entry-summary { margin: 10px 0 6px; font-size: 13px; color: var(--wd-text); line-height: 1.7; }
.kb__entry-detail { margin: 0 0 8px; font-size: 12px; color: var(--wd-text-dim); line-height: 1.7; padding: 8px 10px; background: rgba(6, 21, 40, 0.5); border-radius: 6px; border-left: 2px solid var(--wd-primary); }
.kb__mock-tag { font-size: 10px; color: var(--wd-accent); opacity: 0.8; }
.kb__empty { padding: 20px; text-align: center; font-size: 12px; color: var(--wd-text-dim); }
.kb-detail-enter-active, .kb-detail-leave-active { transition: opacity 0.2s; max-height: 400px; overflow: hidden; }
.kb-detail-enter-from, .kb-detail-leave-to { opacity: 0; max-height: 0; }
</style>

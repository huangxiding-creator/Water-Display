<script setup lang="ts">
/**
 * Generic config-driven chapter renderer.
 * Handles: profile, status, requirements, framework, twin-platform,
 * data-foundation, knowledge-base, infrastructure, security.
 * Each branch pulls directly from the active ProjectConfig.
 */
import { computed } from 'vue'
import { project, navIndex } from '@/data/project'
import PageHeader from '@/components/PageHeader.vue'
import Panel from '@/components/Panel.vue'
import FeatureRow from '@/components/FeatureRow.vue'
import FigureImage from '@/components/FigureImage.vue'
import KnowledgeBrowser from '@/components/KnowledgeBrowser.vue'
import FrameworkExplorer from '@/components/FrameworkExplorer.vue'
import DataFlowDiagram from '@/components/DataFlowDiagram.vue'
import TopologyExplorer from '@/components/TopologyExplorer.vue'
import PerformanceDashboard from '@/components/PerformanceDashboard.vue'
import EChart from '@/components/EChart.vue'
import { CHART_PALETTE, AXIS_STYLE, TOOLTIP_STYLE } from '@/composables/echarts'

const props = defineProps<{ chapterId: string }>()

const navItem = computed(() => navIndex.get(props.chapterId))
const title = computed(() => navItem.value?.title ?? '')
const refTag = computed(() => navItem.value?.ref)

/** Real report figures reused on this chapter (per project config). */
const chapterFigures = computed(() => project.figures.filter((f) => f.chapterId === props.chapterId))

/* ---- per-chapter derived data ---- */

const entityRows = computed(() =>
  project.engineering.entities.map((e) => ({ ...e, cells: [e.name, String(e.count), e.remark ?? ''] })),
)

const sensorOption = {
  grid: { top: 30, right: 20, bottom: 30, left: 120 },
  tooltip: { ...TOOLTIP_STYLE, trigger: 'axis', axisPointer: { type: 'shadow' } },
  xAxis: { type: 'value', ...AXIS_STYLE },
  yAxis: { type: 'category', data: project.infrastructure.sensors.slice(0, 8).map((s) => s.name), ...AXIS_STYLE },
  series: [
    {
      type: 'bar',
      data: project.infrastructure.sensors.slice(0, 8).map((s, i) => ({
        value: s.count,
        itemStyle: { color: CHART_PALETTE[i % CHART_PALETTE.length], borderRadius: [0, 4, 4, 0] },
      })),
      barWidth: '55%',
    },
  ],
}

const principleItems = [
  { name: '统一规划，分步实施', desc: '科学确定数字化、智能化、智慧化分阶段目标' },
  { name: '需求牵引，应用主导', desc: '践行工程补短板、行业强监管总基调' },
  { name: '夯实基础，突出重点', desc: '水利信息化"四个一"建设总体思路' },
  { name: '统一标准，充分共享', desc: '全面推进资源交互共享，充分利旧' },
  { name: '整合资源，优化创新', desc: '融合新一代信息技术，提升智能决策' },
]

const userTiers = [
  { tier: '一级', org: '江巷灌区管理局', count: 1, duty: '全面负责建设及运行期管理、灌溉用水调度' },
  { tier: '二级', org: '管理处', count: 3, duty: '辖区内用水管理、工程维修、供水生产、水量分配' },
  { tier: '三级', org: '管理处(分局)', count: 5, duty: '江巷水库、蔡桥、大余、湾孙、墩子王' },
  { tier: '四级', org: '管理所', count: 12, duty: '渠道灌溉用水管理、工程维修、水费征收' },
  { tier: '五级', org: '用水者协会', count: 0, duty: '组织村民管好斗、农、毛渠输配水' },
]

</script>

<template>
  <div class="cp">
    <PageHeader :title="title" :ref-tag="refTag" :subtitle="navItem?.ref ? `对应报告章节 ${navItem.ref}` : ''" />

    <!-- ============ PROFILE ============ -->
    <template v-if="chapterId === 'profile'">
      <Panel v-if="chapterFigures.length" title="工程图示（复用初设报告原图）" ref-tag="15.1" class="cp__block">
        <div class="cp__figures">
          <FigureImage
            v-for="(f, i) in chapterFigures"
            :key="i"
            :src="f.src"
            :caption="f.caption"
            :ref-tag="f.ref"
            :type="f.type"
          />
        </div>
      </Panel>
      <Panel title="工程概况" ref-tag="15.1.1" class="cp__block">
        <p class="cp__lead">
          江巷灌区位于安徽省滁州市、合肥市境内，池河、滁河上游，总面积
          <strong>{{ project.engineering.totalArea }} km²</strong>，设计灌溉面积
          <strong>{{ project.engineering.designIrrigationArea }} 万亩</strong>。
          以农田灌溉、城乡供水为主，兼顾河道生态补水。
        </p>
        <div class="cp__three">
          <div class="cp__three-card">
            <h4>灌溉工程</h4>
            <p>干渠25条156.89km、支渠79条281.97km；新建渠道290.84km、改建104.02km</p>
          </div>
          <div class="cp__three-card">
            <h4>引江水源骨干泵站及输水工程</h4>
            <p>驷马山乌江站、滁河一至四级站增容，新增装机18台/42600kW；新建四级站干渠13.2km</p>
          </div>
          <div class="cp__three-card">
            <h4>城乡供水水源工程</h4>
            <p>新建童王提水站 + 35.5km 管道向芝麻水库补水，设计流量 1.93m³/s</p>
          </div>
        </div>
      </Panel>

      <Panel title="工程建筑物一览" ref-tag="15.1.1" class="cp__block">
        <table class="tbl">
          <thead><tr><th>类别</th><th>数量</th><th>备注</th></tr></thead>
          <tbody>
            <tr v-for="(row, i) in entityRows" :key="i">
              <td>{{ row.cells[0] }}</td>
              <td class="num">{{ row.cells[1] }}</td>
              <td class="muted">{{ row.cells[2] }}</td>
            </tr>
          </tbody>
        </table>
      </Panel>

      <Panel title="建设单位与管理机构" ref-tag="15.1.2" class="cp__block">
        <div class="cp__tiers">
          <div v-for="t in userTiers" :key="t.tier" class="cp__tier">
            <span class="cp__tier-badge">{{ t.tier }}</span>
            <div>
              <div class="cp__tier-org">{{ t.org }} <span v-if="t.count" class="wd-tag">{{ t.count }}个</span></div>
              <div class="cp__tier-duty">{{ t.duty }}</div>
            </div>
          </div>
        </div>
      </Panel>
    </template>

    <!-- ============ STATUS ============ -->
    <template v-else-if="chapterId === 'status'">
      <Panel title="现状基础" ref-tag="15.2.1" class="cp__block">
        <div class="cp__status-grid">
          <div class="cp__status-card">
            <h4>省水利厅平台</h4>
            <ul>
              <li>水利大数据中心：汇聚 <strong>25.2亿条</strong>，共享 <strong>12.1亿条</strong></li>
              <li>数据资源目录 <strong>1698个</strong>，五大类数据</li>
              <li>知识平台 <strong>~300GB</strong> 文本/表格资源</li>
              <li>全省一张图 1:10000（0.5m），局部 1:1000</li>
            </ul>
          </div>
          <div class="cp__status-card">
            <h4>灌区现状</h4>
            <ul>
              <li>水位/雨量采集点各 27 个，墒情站 18 座</li>
              <li>已建视频监控 235 处</li>
              <li>巡检机器人 1 套、无人机 5 台</li>
              <li>本地业务系统 <strong>尚未建设</strong></li>
            </ul>
          </div>
        </div>
      </Panel>

      <Panel title="存在问题（点击批注您的意见）" ref-tag="15.2.4" class="cp__block">
        <div class="cp__problems">
          <FeatureRow
            v-for="(p, i) in project.problems"
            :key="i"
            :name="`问题${i + 1}`"
            :desc="p"
            :chapter-id="chapterId"
            :chapter-title="title"
          />
        </div>
      </Panel>
    </template>

    <!-- ============ REQUIREMENTS ============ -->
    <template v-else-if="chapterId === 'requirements'">
      <Panel title="用户需求 — 五级管理体系" ref-tag="15.3.1" class="cp__block">
        <div class="cp__tiers">
          <div v-for="t in userTiers" :key="t.tier" class="cp__tier">
            <span class="cp__tier-badge">{{ t.tier }}</span>
            <div>
              <div class="cp__tier-org">{{ t.org }}</div>
              <div class="cp__tier-duty">{{ t.duty }}</div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="业务需求 — 三大核心业务域" ref-tag="15.3.2" class="cp__block">
        <FeatureRow name="水资源调度业务" desc="全方位监视水雨情态势；历史重演、实时仿真、未来推演；四预+综合决策会商" :chapter-id="chapterId" :chapter-title="title" />
        <FeatureRow name="水旱灾害防御业务" desc="防汛抗旱推演与仿真模拟；预报预警、分析、预案" :chapter-id="chapterId" :chapter-title="title" />
        <FeatureRow name="工程运行管理业务" desc="工程结构安全状态与设施设备运行状态监视评估" :chapter-id="chapterId" :chapter-title="title" />
      </Panel>

      <Panel title="性能需求 · 可视化（并发/响应/带宽仪表）" ref-tag="15.3.4" class="cp__block">
        <PerformanceDashboard />
      </Panel>
      <Panel title="安全需求" ref-tag="15.3.5" class="cp__block">
        <div class="cp__sec">
          <span class="wd-chip">控制专网 {{ project.security.controlLevel }}</span>
          <span class="wd-chip wd-chip--accent">业务网 {{ project.security.businessLevel }}</span>
        </div>
        <div class="cp__sec-tags">
          <span v-for="m in project.security.measures" :key="m" class="wd-tag">{{ m }}</span>
        </div>
      </Panel>
    </template>

    <!-- ============ FRAMEWORK ============ -->
    <template v-else-if="chapterId === 'framework'">
      <Panel v-if="chapterFigures.length" title="总体框架图（复用初设报告原图）" ref-tag="15.4.3" class="cp__block">
        <div class="cp__figures">
          <FigureImage
            v-for="(f, i) in chapterFigures"
            :key="i"
            :src="f.src"
            :caption="f.caption"
            :ref-tag="f.ref"
            :type="f.type"
          />
        </div>
      </Panel>
      <Panel title="总体框架 · 可交互探索" ref-tag="15.4.3" class="cp__block">
        <FrameworkExplorer />
      </Panel>
      <Panel title="建设原则" ref-tag="15.4.2" class="cp__block">
        <div class="cp__principles">
          <div v-for="(p, i) in principleItems" :key="i" class="cp__principle">
            <span class="cp__p-idx">0{{ i + 1 }}</span>
            <div>
              <div class="cp__p-name">{{ p.name }}</div>
              <div class="cp__p-desc">{{ p.desc }}</div>
            </div>
          </div>
        </div>
      </Panel>
      <Panel title="建设内容（七大板块）" ref-tag="15.4.4" class="cp__block">
        <div class="cp__seven">
          <div v-for="(s, i) in ['数字孪生平台','信息化基础设施','业务应用','网络安全','保障体系','共建共享','系统集成']" :key="i" class="cp__seven-card">
            <span class="cp__seven-idx">0{{ i + 1 }}</span>
            <span>{{ s }}</span>
          </div>
        </div>
      </Panel>
    </template>

    <!-- ============ TWIN PLATFORM (parent) ============ -->
    <template v-else-if="chapterId === 'twin-platform'">
      <Panel title="数字孪生平台 — 三大组成部分" ref-tag="15.5.1" class="cp__block">
        <div class="cp__twin3">
          <router-link to="/data-foundation" class="cp__twin-card">
            <div class="cp__twin-icon">📊</div>
            <h4>数据底板</h4>
            <p>基础/监测/业务管理/地理空间/跨行业共享五大类；L1/L2/L3 三级精度</p>
          </router-link>
          <router-link to="/model-library" class="cp__twin-card">
            <div class="cp__twin-icon">🧮</div>
            <h4>模型库</h4>
            <p>{{ project.twinPlatform.models.length }} 类专业模型，提供"算法"保证，支撑四预</p>
          </router-link>
          <router-link to="/knowledge-base" class="cp__twin-card">
            <div class="cp__twin-icon">🧠</div>
            <h4>知识库</h4>
            <p>{{ project.twinPlatform.knowledgeBases.length }} 大库，数字孪生智能内核</p>
          </router-link>
        </div>
      </Panel>
    </template>

    <!-- ============ DATA FOUNDATION ============ -->
    <template v-else-if="chapterId === 'data-foundation'">
      <Panel title="数据底板 · 可交互（流向动画 + L1/L2/L3 精度探索）" ref-tag="15.5.1.1" class="cp__block">
        <DataFlowDiagram />
      </Panel>
      <Panel title="数据资源类别" ref-tag="15.5.1.1" class="cp__block">
        <table class="tbl">
          <thead><tr><th>数据类别</th><th>数量</th><th>备注</th></tr></thead>
          <tbody>
            <tr v-for="(c, i) in project.twinPlatform.dataCategories" :key="i">
              <td>{{ c.name }}</td>
              <td class="num">{{ c.count }}</td>
              <td class="muted">{{ c.remark }}</td>
            </tr>
          </tbody>
        </table>
      </Panel>
      <Panel title="数据流向" class="cp__block">
        <div class="cp__flow">
          <span class="cp__flow-node">数据资源</span>
          <span class="cp__flow-arrow">→</span>
          <span class="cp__flow-node">归集库</span>
          <span class="cp__flow-arrow">→ 治理 →</span>
          <span class="cp__flow-node">基础库</span>
          <span class="cp__flow-arrow">→</span>
          <span class="cp__flow-node cp__flow-node--accent">主题库</span>
          <span class="cp__flow-arrow">→</span>
          <span class="cp__flow-node">业务应用 / 省厅共享</span>
        </div>
      </Panel>
    </template>

    <!-- ============ KNOWLEDGE BASE ============ -->
    <template v-else-if="chapterId === 'knowledge-base'">
      <Panel title="知识库浏览 · 测试数据演示" ref-tag="15.5.1.3" class="cp__block">
        <p class="cp__lead" style="margin-bottom: 14px">
          点击任一知识库查看其中的 <strong>测试数据条目</strong>（模拟）。真实平台对接知识引擎 + 向量库；此处展示每个库"装什么、怎么用"。
        </p>
        <KnowledgeBrowser />
      </Panel>
      <Panel title="八大知识库概览" ref-tag="15.5.1.3" class="cp__block">
        <div class="cp__kb-grid">
          <div v-for="kb in project.twinPlatform.knowledgeBases" :key="kb.id" class="cp__kb-card wd-panel">
            <h4 class="cp__kb-name">{{ kb.name }}</h4>
            <p class="cp__kb-purpose">{{ kb.purpose }}</p>
            <div class="cp__kb-tags">
              <span v-for="c in kb.content" :key="c" class="wd-tag">{{ c }}</span>
            </div>
          </div>
        </div>
      </Panel>
    </template>

    <!-- ============ INFRASTRUCTURE ============ -->
    <template v-else-if="chapterId === 'infrastructure'">
      <Panel title="遥测网络拓扑 · 可交互（1:7:624，点击分中心）" ref-tag="15.5.2" class="cp__block">
        <TopologyExplorer />
      </Panel>
      <div class="cp__two">
        <Panel title="感知网构成" ref-tag="15.5.2.1">
          <EChart :option="sensorOption" height="280px" />
        </Panel>
        <Panel title="设备清单" ref-tag="15.5.2">
          <table class="tbl tbl--compact">
            <thead><tr><th>设备/资源</th><th>数量</th><th>备注</th></tr></thead>
            <tbody>
              <tr v-for="(s, i) in project.infrastructure.servers" :key="i">
                <td>{{ s.name }}</td>
                <td class="num">{{ s.count }}</td>
                <td class="muted">{{ s.remark }}</td>
              </tr>
              <tr><td>远控直属泵站</td><td class="num">{{ project.infrastructure.controlStations }}</td><td class="muted">座</td></tr>
              <tr><td>远控放水涵</td><td class="num">{{ project.infrastructure.culverts }}</td><td class="muted">处</td></tr>
            </tbody>
          </table>
        </Panel>
      </div>
    </template>

    <!-- ============ SECURITY & INTEGRATION ============ -->
    <template v-else-if="chapterId === 'security'">
      <Panel title="网络信息安全" ref-tag="15.5.5" class="cp__block">
        <div class="cp__sec">
          <span class="wd-chip">控制专网 {{ project.security.controlLevel }}</span>
          <span class="wd-chip wd-chip--accent">业务网 {{ project.security.businessLevel }}</span>
        </div>
        <div class="cp__sec-tags">
          <span v-for="m in project.security.measures" :key="m" class="wd-tag">{{ m }}</span>
        </div>
      </Panel>
      <Panel title="信息资源共享与系统集成" ref-tag="15.5.4 / 15.5.6" class="cp__block">
        <FeatureRow name="共建共享" desc="数据服务、消息队列、数据库同步、数据交换 — 与省水利厅互联互通" :chapter-id="chapterId" :chapter-title="title" />
        <FeatureRow name="系统集成" desc="集约建设、弹性扩展、统一框架、分层整合" :chapter-id="chapterId" :chapter-title="title" />
        <FeatureRow name="保障体系" desc="可实施、可承担的可持续运行保障方案" :chapter-id="chapterId" :chapter-title="title" />
      </Panel>
    </template>

    <!-- fallback -->
    <template v-else>
      <Panel title="章节内容">
        <p class="cp__lead">本章节内容正在建设中。</p>
      </Panel>
    </template>
  </div>
</template>

<style scoped>
@import '@/styles/_chapter.css';
</style>

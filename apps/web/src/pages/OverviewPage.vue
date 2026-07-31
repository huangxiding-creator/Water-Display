<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { project } from '@/data/project'
import KpiCard from '@/components/KpiCard.vue'
import Panel from '@/components/Panel.vue'
import EChart from '@/components/EChart.vue'
import LogoMark from '@/components/LogoMark.vue'
import { CHART_PALETTE, TOOLTIP_STYLE } from '@/composables/echarts'
import type { ChapterId } from '@wd/config'

const router = useRouter()

const frameworkLayers = [
  {
    id: 'app' as ChapterId,
    name: '业务应用层',
    desc: '供需水预报 · 水资源配置调度 · 水旱灾害防御 · 工程管理 · 灌区一张图 · 远程监控 · 公共服务 · 综合门户',
    items: ['供需水预报', '水资源配置与调度', '水旱灾害防御', '供用水管理', '工程管理', '灌区一张图', '远程集中监控', '水公共服务', '综合门户'],
  },
  {
    id: 'twin-platform' as ChapterId,
    name: '数字孪生平台（核心）',
    desc: '数据底板 · 模型库 · 知识库 · 孪生引擎',
    items: ['数据底板', '水利专业模型', '智能识别模型', '仿真引擎', '知识库', '地面标定'],
  },
  {
    id: 'infrastructure' as ChapterId,
    name: '信息化基础设施',
    desc: '感知网 · 自动控制 · 通讯网络 · 运行环境 · 应用支撑',
    items: ['感知网 624', '自动控制 31站', '通讯网络', '运行环境', '应用支撑平台'],
  },
]

// ---- mock charts driven by config ----
const sensorOption = computed(() => ({
  tooltip: { ...TOOLTIP_STYLE, trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: '#7FA8D0', fontSize: 11 }, itemWidth: 10, itemHeight: 10 },
  series: [
    {
      type: 'pie',
      radius: ['45%', '72%'],
      center: ['50%', '42%'],
      avoidLabelOverlap: true,
      itemStyle: { borderColor: '#061528', borderWidth: 2 },
      label: { show: false },
      data: project.infrastructure.sensors.slice(0, 6).map((s, i) => ({
        name: s.name,
        value: s.count,
        itemStyle: { color: CHART_PALETTE[i % CHART_PALETTE.length] },
      })),
    },
  ],
}))

const modelRadarOption = {
  tooltip: { ...TOOLTIP_STYLE },
  radar: {
    indicator: [
      { name: '水文预报', max: 10 },
      { name: '需水预测', max: 10 },
      { name: '水动力学', max: 10 },
      { name: '配置调度', max: 10 },
      { name: '防洪调度', max: 10 },
      { name: '工程安全', max: 10 },
    ],
    splitArea: { areaStyle: { color: ['rgba(0,212,255,0.02)', 'rgba(0,212,255,0.05)'] } },
    splitLine: { lineStyle: { color: 'rgba(127,168,208,0.15)' } },
    axisLine: { lineStyle: { color: 'rgba(127,168,208,0.2)' } },
    name: { color: '#7FA8D0', fontSize: 11 },
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: [9, 8, 9, 9, 8, 9],
          name: '模型能力覆盖',
          areaStyle: { color: 'rgba(0,212,255,0.25)' },
          lineStyle: { color: '#00D4FF', width: 2 },
          itemStyle: { color: '#00D4FF' },
        },
      ],
    },
  ],
}

const dispatchSankeyOption = {
  tooltip: { ...TOOLTIP_STYLE, trigger: 'item' },
  series: [
    {
      type: 'sankey',
      top: 10,
      bottom: 10,
      right: 60,
      left: 20,
      nodeWidth: 14,
      nodeGap: 10,
      layoutIterations: 32,
      label: { color: '#E6F2FF', fontSize: 11 },
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.5 },
      data: [
        { name: '江巷水库', itemStyle: { color: '#00D4FF' } },
        { name: '驷马山引江', itemStyle: { color: '#0066FF' } },
        { name: '蔡桥水库', itemStyle: { color: '#36CFC9' } },
        { name: '直供片', itemStyle: { color: '#FFB100' } },
        { name: '联合灌片', itemStyle: { color: '#FFB100' } },
        { name: '余庄片', itemStyle: { color: '#FFB100' } },
        { name: '八龙片', itemStyle: { color: '#FFB100' } },
        { name: '城乡供水', itemStyle: { color: '#52C41A' } },
        { name: '生态补水', itemStyle: { color: '#52C41A' } },
      ],
      links: [
        { source: '江巷水库', target: '直供片', value: 35 },
        { source: '江巷水库', target: '联合灌片', value: 28 },
        { source: '蔡桥水库', target: '联合灌片', value: 18 },
        { source: '驷马山引江', target: '余庄片', value: 22 },
        { source: '驷马山引江', target: '八龙片', value: 16 },
        { source: '驷马山引江', target: '城乡供水', value: 12 },
        { source: '江巷水库', target: '生态补水', value: 8 },
      ],
    },
  ],
}

function go(id: string) {
  router.push({ name: id })
}
</script>

<template>
  <div class="ov">
    <!-- Hero strip -->
    <div class="ov__hero wd-panel wd-fade-in">
      <div class="ov__hero-bg" />
      <div class="ov__hero-content">
        <div class="ov__hero-brand">
          <LogoMark :mark="project.brand.logo.mark" :size="56" />
          <div>
            <h1 class="ov__hero-title">{{ project.brand.systemName }}</h1>
            <p class="ov__hero-sub">预报 · 预警 · 预演 · 预案 ｜ 数字化场景 · 智慧化模拟 · 精准化决策</p>
          </div>
        </div>
        <p class="ov__hero-desc">
          本平台依据《{{ project.report?.title }}》第 15 章工程信息化需求构建，将报告内容可视化、可交互、可批注，
          帮助业主单位快速理解数字孪生建设需求，便于进一步沟通确认。
        </p>
      </div>
    </div>

    <!-- KPI grid -->
    <div class="ov__kpis">
      <KpiCard
        v-for="(k, i) in project.kpis"
        :key="i"
        :label="k.label"
        :value="k.value"
        :unit="k.unit"
        :style="{ animationDelay: `${i * 0.05}s` }"
      />
    </div>

    <!-- Framework diagram (interactive) -->
    <Panel title="总体框架（点击层级进入详情）" ref-tag="15.4.3" fill class="ov__framework">
      <div class="framework">
        <div
          v-for="(layer, idx) in frameworkLayers"
          :key="layer.id"
          class="framework__layer"
          :style="{ animationDelay: `${idx * 0.1}s` }"
          @click="go(layer.id)"
        >
          <div class="framework__layer-head">
            <span class="framework__idx">0{{ frameworkLayers.length - idx }}</span>
            <span class="framework__layer-name">{{ layer.name }}</span>
          </div>
          <div class="framework__layer-desc">{{ layer.desc }}</div>
          <div class="framework__items">
            <span v-for="it in layer.items" :key="it" class="framework__item">{{ it }}</span>
          </div>
        </div>
      </div>
      <!-- Safeguard bands -->
      <div class="framework__bands">
        <div class="framework__band" @click="go('security')">网络安全保障体系 · {{ project.security.controlLevel }}</div>
        <div class="framework__band framework__band--accent">共建共享 · 运维保障 · 系统集成</div>
      </div>
    </Panel>

    <!-- Charts row -->
    <div class="ov__charts">
      <Panel title="感知网构成" ref-tag="15.5.2.1">
        <EChart :option="sensorOption" height="240px" />
      </Panel>
      <Panel title="模型能力覆盖" ref-tag="15.5.1.2">
        <EChart :option="modelRadarOption" height="240px" />
      </Panel>
      <Panel title="水资源配置流向（示意）" ref-tag="15.5.3.2">
        <EChart :option="dispatchSankeyOption" height="240px" />
      </Panel>
    </div>

    <!-- Highlights -->
    <Panel title="三大工程" ref-tag="15.1.1" class="ov__highlights">
      <ul class="hl">
        <li v-for="(h, i) in project.engineering.highlights" :key="i" class="hl__item">
          <span class="hl__bullet" />
          {{ h }}
        </li>
      </ul>
    </Panel>
  </div>
</template>

<style scoped>
.ov {
  display: flex;
  flex-direction: column;
  gap: var(--wd-gap);
}

/* hero */
.ov__hero {
  padding: 28px 32px;
  position: relative;
  overflow: hidden;
}
.ov__hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 90% 50%, rgba(0, 102, 255, 0.18), transparent 60%),
    linear-gradient(135deg, rgba(0, 212, 255, 0.05), transparent);
  pointer-events: none;
}
.ov__hero-content {
  position: relative;
  z-index: 1;
}
.ov__hero-brand {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 12px;
}
.ov__hero-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  background: var(--wd-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
}
.ov__hero-sub {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--wd-text-dim);
  letter-spacing: 1px;
}
.ov__hero-desc {
  margin: 0;
  max-width: 900px;
  font-size: 13px;
  color: var(--wd-text-dim);
  line-height: 1.8;
}

/* kpis */
.ov__kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--wd-gap);
}
@media (max-width: 1200px) {
  .ov__kpis { grid-template-columns: repeat(2, 1fr); }
}

/* framework */
.framework {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0;
}
.framework__layer {
  padding: 14px 18px;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.08), rgba(0, 212, 255, 0.02));
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-left: 3px solid var(--wd-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  animation: wd-fade-in 0.4s ease both;
}
.framework__layer:hover {
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.15), rgba(0, 212, 255, 0.05));
  transform: translateX(4px);
}
.framework__layer-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}
.framework__idx {
  font-family: var(--wd-font-mono);
  font-size: 12px;
  color: var(--wd-primary);
  opacity: 0.7;
}
.framework__layer-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--wd-text);
}
.framework__layer-desc {
  font-size: 12px;
  color: var(--wd-text-dim);
  margin-bottom: 8px;
}
.framework__items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.framework__item {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0, 212, 255, 0.1);
  color: var(--wd-primary);
}
.framework__bands {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
.framework__band {
  flex: 1;
  text-align: center;
  padding: 8px;
  font-size: 12px;
  border: 1px dashed rgba(255, 177, 0, 0.3);
  border-radius: 6px;
  color: var(--wd-accent);
  background: rgba(255, 177, 0, 0.04);
  cursor: pointer;
  transition: all 0.2s;
}
.framework__band:hover {
  background: rgba(255, 177, 0, 0.1);
}
.framework__band--accent {
  border-color: rgba(127, 168, 208, 0.3);
  color: var(--wd-text-dim);
}

/* charts */
.ov__charts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--wd-gap);
}
@media (max-width: 1200px) {
  .ov__charts { grid-template-columns: 1fr; }
}

/* highlights */
.hl {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hl__item {
  display: flex;
  gap: 10px;
  font-size: 13px;
  color: var(--wd-text);
  line-height: 1.7;
}
.hl__bullet {
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  margin-top: 9px;
  border-radius: 50%;
  background: var(--wd-primary);
  box-shadow: 0 0 8px var(--wd-primary);
}
</style>

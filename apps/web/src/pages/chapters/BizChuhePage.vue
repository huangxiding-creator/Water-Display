<script setup lang="ts">
import { project } from '@/data/project'
import PageHeader from '@/components/PageHeader.vue'
import Panel from '@/components/Panel.vue'
import FeatureRow from '@/components/FeatureRow.vue'
import PumpStationBim from '@/components/PumpStationBim.vue'
import CockpitSimulator from '@/components/simulators/CockpitSimulator.vue'

const mod = project.businessModules.find((m) => m.id === 'biz-chuhe')
</script>

<template>
  <div class="cp" v-if="mod">
    <PageHeader title="数字孪生滁河一级站" ref-tag="15.5.3.10" subtitle="泵站统览 · 智能调度 · 巡查管理 — 大型泵站专题孪生" />

    <Panel title="BIM 机组拆解（可交互 3D）" ref-tag="15.5.3.10" class="cp__block">
      <p class="cp__lead" style="margin-bottom: 14px">
        点击「拆解机组」将 6 台机组分解为 <strong>电动机 / 主轴 / 叶轮 / 蜗壳</strong> 等关键部件；
        鼠标拖动旋转、滚轮缩放、点击部件查看属性。对应报告"高精度 BIM 模型支持机组模型拆解"。
      </p>
      <PumpStationBim />
    </Panel>

    <Panel title="泵站驾驶舱（实时监控模拟）" ref-tag="15.5.3.7" class="cp__block">
      <CockpitSimulator chapter-id="biz-chuhe" chapter-title="数字孪生滁河一级站" />
    </Panel>

    <Panel v-for="(sub, i) in mod.subModules" :key="i" :title="sub.name" class="cp__block">
      <FeatureRow
        v-for="f in sub.features"
        :key="f.name"
        :name="f.name"
        :desc="f.desc"
        chapter-id="biz-chuhe"
        chapter-title="数字孪生滁河一级站"
      />
    </Panel>
  </div>
</template>

<style scoped>
@import '@/styles/_chapter.css';
</style>

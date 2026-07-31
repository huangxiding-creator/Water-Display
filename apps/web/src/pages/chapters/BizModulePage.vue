<script setup lang="ts">
import { computed } from 'vue'
import { project } from '@/data/project'
import PageHeader from '@/components/PageHeader.vue'
import Panel from '@/components/Panel.vue'
import FeatureRow from '@/components/FeatureRow.vue'
import BizVisual from '@/components/BizVisual.vue'
import DispatchSimulator from '@/components/simulators/DispatchSimulator.vue'
import FloodSimulator from '@/components/simulators/FloodSimulator.vue'
import CockpitSimulator from '@/components/simulators/CockpitSimulator.vue'

const props = defineProps<{ chapterId: string }>()

const module = computed(() => project.businessModules.find((m) => m.id === props.chapterId))
const simLabel = computed(() => {
  switch (module.value?.simulator) {
    case 'dispatch': return '四预调度演练模拟器'
    case 'flood': return '洪水淹没预演模拟器'
    case 'cockpit': return '泵站驾驶舱模拟器'
    default: return ''
  }
})
</script>

<template>
  <div class="cp" v-if="module">
    <PageHeader :title="module.title" :ref-tag="module.ref" :subtitle="module.purpose" />

    <!-- Hero simulator (mounted first for impact) -->
    <Panel v-if="module.simulator !== 'none'" :title="simLabel" ref-tag="演示交互" class="cp__block">
      <p class="cp__lead" style="margin-bottom: 14px">
        💡 这是 <strong>可交互演示</strong>。业主可拖动/切换参数，直观感受"四预"价值 ——
        非真实生产数据，仅用于需求沟通。
      </p>
      <DispatchSimulator v-if="module.simulator === 'dispatch'" :chapter-id="chapterId" :chapter-title="module.title" />
      <FloodSimulator v-else-if="module.simulator === 'flood'" :chapter-id="chapterId" :chapter-title="module.title" />
      <CockpitSimulator v-else-if="module.simulator === 'cockpit'" :chapter-id="chapterId" :chapter-title="module.title" />
    </Panel>

    <!-- Module-specific mock dashboards (makes every module intuitive, not just text) -->
    <BizVisual :module-id="chapterId" />

    <!-- Sub-modules from config -->
    <Panel v-for="(sub, i) in module.subModules" :key="i" :title="sub.name" class="cp__block">
      <div class="biz__features">
        <FeatureRow
          v-for="f in sub.features"
          :key="f.name"
          :name="f.name"
          :desc="f.desc"
          :chapter-id="chapterId"
          :chapter-title="module.title"
        />
      </div>
    </Panel>
  </div>
</template>

<style scoped>
@import '@/styles/_chapter.css';
.biz__features {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>

<script setup lang="ts">
/**
 * Thin Vue wrapper around ECharts using `defineOption` imperative API.
 * - Resizes with its container (uses ResizeObserver via @vueuse).
 * - Disposes on unmount. Theme tokens from ./composables/echarts.
 */
import { ref, shallowRef, watch, onMounted, onBeforeUnmount } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart, RadarChart, ScatterChart, GaugeChart, MapChart, HeatmapChart, GraphChart, SankeyChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  PolarComponent,
  GeoComponent,
  DataZoomComponent,
  VisualMapComponent,
  GraphicComponent,
  ToolboxComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart, LineChart, PieChart, RadarChart, ScatterChart, GaugeChart, MapChart, HeatmapChart, GraphChart, SankeyChart,
  GridComponent, TooltipComponent, LegendComponent, TitleComponent, PolarComponent, GeoComponent, DataZoomComponent, VisualMapComponent, GraphicComponent, ToolboxComponent,
  CanvasRenderer,
])

const props = defineProps<{
  option: echarts.EChartsCoreOption
  /** height css; default 260px */
  height?: string
}>()

const el = ref<HTMLDivElement | null>(null)
const chart = shallowRef<echarts.ECharts | null>(null)

function ensureChart() {
  if (!el.value) return null
  if (!chart.value) chart.value = echarts.init(el.value)
  return chart.value
}

onMounted(() => {
  const c = ensureChart()
  c?.setOption(props.option)
})

watch(
  () => props.option,
  (opt) => {
    ensureChart()?.setOption(opt, true)
  },
  { deep: true },
)

useResizeObserver(el, () => chart.value?.resize())

onBeforeUnmount(() => {
  chart.value?.dispose()
  chart.value = null
})
</script>

<template>
  <div ref="el" class="echart" :style="{ height: height ?? '260px', width: '100%' }" />
</template>

<style scoped>
.echart {
  min-height: 120px;
}
</style>

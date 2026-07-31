<script setup lang="ts">
/**
 * Interactive layered-architecture explorer — the report's 总体框架图 (15.4.3),
 * made explorable. The framework is the report's centrepiece ("框架图非常重要"),
 * so owners click a layer → see its components → click a component → jump to it.
 * Used on both the Overview dashboard and the Framework chapter.
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface FwComponent { name: string; to?: string; tag?: string }
interface FwLayer {
  id: string
  name: string
  short: string
  desc: string
  color: string
  components: FwComponent[]
}

const layers: FwLayer[] = [
  {
    id: 'app', name: '业务应用层', short: '业务应用', color: '#00D4FF',
    desc: '围绕灌溉供水、城乡供水、生态补水核心业务，以"四预"手段建设的业务实例。',
    components: [
      { name: '供需水预报与决策', to: 'biz-forecast' },
      { name: '水资源配置与调度', to: 'biz-allocation', tag: '四预' },
      { name: '水旱灾害防御', to: 'biz-disaster', tag: '四预' },
      { name: '供用水管理', to: 'biz-supply' },
      { name: '工程管理', to: 'biz-engineering' },
      { name: '灌区一张图', to: 'biz-onemap' },
      { name: '远程集中监控', to: 'biz-monitor' },
      { name: '水公共服务', to: 'biz-public' },
      { name: '综合门户', to: 'biz-portal' },
    ],
  },
  {
    id: 'engine', name: '孪生引擎', short: '孪生引擎', color: '#36CFC9',
    desc: '数字孪生模拟仿真引擎：数据接入融合、场景管理、可视化渲染、仿真设计、三维优化。',
    components: [
      { name: '本地高渲染 + 在线云渲染', to: 'model-library' },
      { name: 'BIM/倾斜摄影轻量化', to: 'model-library' },
      { name: '物理驱动 / 碰撞检测 / 流场仿真', to: 'model-library' },
    ],
  },
  {
    id: 'twin', name: '数字孪生平台（核心）', short: '孪生平台', color: '#FFB100',
    desc: '数据底板 + 模型库 + 知识库，构成数字孪生核心能力，是整个平台最基础最重要的部分。',
    components: [
      { name: '数据底板（L1/L2/L3）', to: 'data-foundation' },
      { name: '模型库（11类）', to: 'model-library' },
      { name: '知识库（8库）', to: 'knowledge-base' },
    ],
  },
  {
    id: 'support', name: '应用支撑平台', short: '应用支撑', color: '#B37FEB',
    desc: '共享省厅基础组件 + 自建业务支撑：统一权限、消息中心、工作流、报表。',
    components: [
      { name: '数据收集平台' },
      { name: '视频综合管理平台' },
      { name: 'GIS 服务' },
    ],
  },
  {
    id: 'infra', name: '信息化基础设施', short: '基础设施', color: '#52C41A',
    desc: '感知网、信息网为基础支撑层；1总调+7分调+624遥测的遥测网。',
    components: [
      { name: '感知网（624 遥测）', to: 'infrastructure' },
      { name: '自动控制（31 泵站/214 涵）', to: 'infrastructure' },
      { name: '通讯网络（专网20/数据线39）', to: 'infrastructure' },
      { name: '系统运行环境（超融合等）', to: 'infrastructure' },
    ],
  },
]

const sideBands = [
  { name: '网络安全保障体系', detail: '控制专网 等保三级 / 业务网 等保二级', to: 'security', color: '#FF4D4F' },
  { name: '共建共享 · 运维保障 · 系统集成', detail: '与省水利厅互联互通；可持续运行保障', to: 'security', color: '#7FA8D0' },
]

const activeId = ref<string>('twin')
const activeLayer = computed(() => layers.find((l) => l.id === activeId.value)!)
function go(to?: string) {
  if (to) router.push({ name: to })
}
</script>

<template>
  <div class="fw">
    <div class="fw__stack">
      <!-- side band: security (left) -->
      <div class="fw__side">
        <div class="fw__side-label">保障体系</div>
        <button
          v-for="b in sideBands" :key="b.name"
          class="fw__side-band"
          :style="{ '--c': b.color }"
          @click="go(b.to)"
        >
          <span class="fw__side-name">{{ b.name }}</span>
          <span class="fw__side-detail">{{ b.detail }}</span>
        </button>
      </div>

      <!-- centre: layers (top = app, bottom = infra) -->
      <div class="fw__layers">
        <button
          v-for="(layer, idx) in layers"
          :key="layer.id"
          class="fw__layer"
          :class="{ 'fw__layer--active': activeId === layer.id }"
          :style="{ '--c': layer.color, animationDelay: `${idx * 0.06}s` }"
          @click="activeId = layer.id"
          @dblclick="layer.components[0]?.to && go(layer.components[0].to)"
        >
          <span class="fw__layer-idx">L{{ layers.length - idx }}</span>
          <span class="fw__layer-name">{{ layer.name }}</span>
          <span class="fw__layer-count">{{ layer.components.length }}</span>
        </button>
      </div>
    </div>

    <!-- flow connectors hint -->
    <div class="fw__flow-hint">数据自下而上汇聚 · 业务自上而下调用 · 点击层级查看组件 · 双击进入</div>

    <!-- active layer detail -->
    <transition name="fw-detail" mode="out-in">
      <div :key="activeId" class="fw__detail" :style="{ '--c': activeLayer.color }">
        <div class="fw__detail-head">
          <span class="fw__detail-dot" />
          <span class="fw__detail-name">{{ activeLayer.name }}</span>
        </div>
        <p class="fw__detail-desc">{{ activeLayer.desc }}</p>
        <div class="fw__detail-comps">
          <button
            v-for="c in activeLayer.components"
            :key="c.name"
            class="fw__comp"
            :class="{ 'fw__comp--link': c.to }"
            @click="go(c.to)"
          >
            {{ c.name }}
            <span v-if="c.tag" class="fw__comp-tag">{{ c.tag }}</span>
            <span v-if="c.to" class="fw__comp-go">→</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fw { display: flex; flex-direction: column; gap: 12px; }
.fw__stack { display: grid; grid-template-columns: 170px 1fr; gap: 14px; }

.fw__side { display: flex; flex-direction: column; gap: 8px; }
.fw__side-label { font-size: 11px; color: var(--wd-text-dim); text-align: center; }
.fw__side-band {
  flex: 1; padding: 10px 12px; border-radius: 8px; text-align: left; cursor: pointer;
  background: rgba(255, 77, 79, 0.04);
  border: 1px solid color-mix(in srgb, var(--c) 40%, transparent);
  border-left: 3px solid var(--c);
  transition: all 0.18s;
}
.fw__side-band:hover { background: color-mix(in srgb, var(--c) 12%, transparent); }
.fw__side-name { display: block; font-size: 12px; font-weight: 600; color: var(--wd-text); }
.fw__side-detail { display: block; font-size: 10px; color: var(--wd-text-dim); margin-top: 3px; line-height: 1.5; }

.fw__layers { display: flex; flex-direction: column; gap: 7px; }
.fw__layer {
  display: flex; align-items: center; gap: 12px; padding: 13px 16px; border-radius: 8px;
  cursor: pointer; text-align: left; transition: all 0.2s;
  background: linear-gradient(90deg, color-mix(in srgb, var(--c) 14%, transparent), color-mix(in srgb, var(--c) 3%, transparent));
  border: 1px solid color-mix(in srgb, var(--c) 30%, transparent);
  border-left: 3px solid var(--c);
  animation: wd-fade-in 0.4s ease both;
}
.fw__layer:hover { transform: translateX(4px); }
.fw__layer--active {
  border-color: var(--c);
  box-shadow: 0 0 0 1px var(--c), 0 8px 20px color-mix(in srgb, var(--c) 25%, transparent);
  transform: translateX(4px);
}
.fw__layer-idx { font-family: var(--wd-font-mono); font-size: 11px; color: var(--c); opacity: 0.7; min-width: 22px; }
.fw__layer-name { flex: 1; font-size: 14px; font-weight: 600; color: var(--wd-text); }
.fw__layer-count { font-family: var(--wd-font-mono); font-size: 11px; padding: 2px 8px; border-radius: 999px; background: color-mix(in srgb, var(--c) 18%, transparent); color: var(--c); }

.fw__flow-hint { font-size: 11px; color: var(--wd-text-dim); text-align: center; opacity: 0.8; }

.fw__detail {
  padding: 14px 16px; border-radius: 10px;
  background: color-mix(in srgb, var(--c) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 25%, transparent);
}
.fw__detail-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.fw__detail-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--c); box-shadow: 0 0 8px var(--c); }
.fw__detail-name { font-size: 14px; font-weight: 600; color: var(--wd-text); }
.fw__detail-desc { margin: 0 0 12px; font-size: 12.5px; color: var(--wd-text-dim); line-height: 1.7; }
.fw__detail-comps { display: flex; flex-wrap: wrap; gap: 7px; }
.fw__comp {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: 12px;
  border-radius: 7px; background: rgba(6, 21, 40, 0.5); border: 1px solid rgba(127, 168, 208, 0.18);
  color: var(--wd-text); transition: all 0.16s;
}
.fw__comp--link { cursor: pointer; }
.fw__comp--link:hover { border-color: var(--c); color: var(--c); background: color-mix(in srgb, var(--c) 10%, transparent); }
.fw__comp-tag { font-size: 9px; padding: 1px 5px; border-radius: 3px; background: var(--c); color: #061528; font-weight: 700; }
.fw__comp-go { font-size: 12px; opacity: 0.7; }

.fw-detail-enter-active, .fw-detail-leave-active { transition: opacity 0.2s, transform 0.2s; }
.fw-detail-enter-from { opacity: 0; transform: translateY(6px); }
.fw-detail-leave-to { opacity: 0; }

@media (max-width: 800px) {
  .fw__stack { grid-template-columns: 1fr; }
}
</style>

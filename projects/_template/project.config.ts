/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  Water-Display 项目配置模板 —— 复制本目录为 projects/<你的工程名>/      ║
 * ║  然后按注释填写。填完执行 `pnpm --filter @wd/project-<name> validate`   ║
 * ║  校验通过后，在 apps/web/src/data/project.ts 切换导入即可生成站点。       ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * 推荐流程：
 *   1. python tools/report-to-frb/docx_extract.py 你的报告.docx
 *      → 自动抽取章节标题 + 表格，生成一份草稿 JSON 供你参照填下面的字段
 *   2. 对照本文件逐块填写（每块都有注释说明对应报告章节）
 *   3. pnpm --filter @wd/project-<name> validate  ← zod 校验，不过会明确报错
 *   4. 改 apps/web/src/data/project.ts 的 import 指向你的新工程
 *   5. pnpm dev 看效果；pnpm --filter @wd/web build:static 出交付包
 *
 * 字段几乎全部可选（schema 有默认值）。只有 brand.systemName 和 nav 必填。
 * 不确定的数据宁可不填，平台会用占位/降级展示，不会崩。
 */
import type { ProjectConfig } from '@wd/config'

export const templateConfig: ProjectConfig = {
  schemaVersion: '1.0',

  /* ───────────────────────── 报告元信息（可选） ───────────────────────── */
  report: {
    title: 'XX工程初步设计报告（报批稿）', // 报告全称
    chapter: '15 工程信息化', // 数字孪生/信息化章节号
    sourceFile: '初步设计报告/xx信息化.pdf', // 原始文件路径（仅记录用）
  },

  /* ───────────────────────── 品牌与外观（必填 systemName） ───────────── */
  brand: {
    systemName: 'XX数字孪生平台', // ★ 全站标题/登录页都用它
    shortName: 'XX孪生', // 顶栏紧凑显示（可选）
    tagline: 'XX Digital Twin Platform', // 英文副标题（可选）
    owner: '建设单位', // 页脚显示
    designer: '设计院', // 页脚显示
    logo: {
      // mark 决定自动生成的 SVG logo 图案；无需提供图片
      mark: 'wave', // 可选: wave | drop | canal | reservoir | river | mountain | custom
      // image: 'logo.png',  // 若有现成 logo，放 assets/ 并填相对路径，会覆盖 mark
    },
    theme: {
      // 配色 —— 改这里全站换肤。建议只改 primary / primaryDeep 两个主色
      primary: '#00D4FF',
      primaryDeep: '#0066FF',
      accent: '#FFB100',
      bgDark: '#061528',
      bgPanel: '#0B2247',
      textMain: '#E6F2FF',
      textDim: '#7FA8D0',
      danger: '#FF4D4F',
      warning: '#FAAD14',
      success: '#52C41A',
    },
  },

  /* ───────────────────────── 导航 / 章节结构（必填） ─────────────────── */
  // 站点导航 = 报告章节结构。chapter id 是固定枚举（水利部大纲统一），
  // 只需改 title 和 ref（报告章节号）。children 用于二级菜单。
  nav: [
    { id: 'overview', title: '总览大屏', ref: '15.1' },
    { id: 'profile', title: '工程概况', ref: '15.1.1' },
    { id: 'status', title: '现状与问题', ref: '15.2' },
    { id: 'requirements', title: '需求分析', ref: '15.3' },
    { id: 'framework', title: '总体方案', ref: '15.4' },
    {
      id: 'twin-platform',
      title: '数字孪生平台',
      ref: '15.5.1',
      children: [
        { id: 'data-foundation', title: '数据底板', ref: '15.5.1.1' },
        { id: 'model-library', title: '模型库', ref: '15.5.1.2' },
        { id: 'knowledge-base', title: '知识库', ref: '15.5.1.3' },
      ],
    },
    { id: 'infrastructure', title: '信息化基础设施', ref: '15.5.2' },
    {
      id: 'biz-forecast',
      title: '业务应用',
      ref: '15.5.3',
      children: [
        { id: 'biz-forecast', title: '供需水预报与决策', ref: '15.5.3.1' },
        { id: 'biz-allocation', title: '水资源配置与调度', ref: '15.5.3.2' },
        { id: 'biz-disaster', title: '水旱灾害防御', ref: '15.5.3.3' },
        { id: 'biz-engineering', title: '工程管理', ref: '15.5.3.5' },
        { id: 'biz-onemap', title: '一张图', ref: '15.5.3.6' },
        { id: 'biz-monitor', title: '远程集中监控', ref: '15.5.3.7' },
        // 按你工程实际有的业务删减/改名；id 必须用枚举值，title 可任意
      ],
    },
    { id: 'security', title: '安全与集成', ref: '15.5.4' },
    { id: 'my-needs', title: '我的需求' },
  ],

  /* ───────────────────────── 总览大屏 KPI（可选） ───────────────────── */
  // 总览页的指标卡。value 是字符串以便带单位
  kpis: [
    { label: '灌区面积', value: 'XXX', unit: 'km²' },
    { label: '业务应用', value: 'N', unit: '模块' },
    // ...
  ],

  /* ───────────────────────── 工程概况（可选） ───────────────────────── */
  engineering: {
    totalArea: 1022, // km²
    designIrrigationArea: 99.3, // 万亩
    highlights: ['工程亮点1', '工程亮点2'], // 总览页"三大工程"那类条目
    entities: [
      // 建筑物清单表。count 是数字
      { name: '水库', count: 13, remark: '备注（可选）' },
      { name: '泵站', count: 44 },
    ],
    geoPoints: [
      // 一张图的真实坐标点。lng/lat 为数字。type 决定图标颜色
      { name: 'XX水库', lng: 117.56, lat: 32.27, type: 'reservoir' },
      // type 可选: reservoir | pump | sluice | canal | video-tower | uav | monitor | office
    ],
  },

  /* ───────────────────────── 数字孪生平台（可选） ───────────────────── */
  twinPlatform: {
    dataLevels: [
      { level: 'L1', precision: '影像优于15m', scope: '复用省级共享' },
      { level: 'L2', precision: '影像优于2m', scope: '工程范围' },
      { level: 'L3', precision: 'BIM LOD3', scope: '关键枢纽' },
    ],
    dataCategories: [{ name: '基础数据', count: 10 }], // 数据底板各类数据量
    models: [
      {
        id: 'm-hydroforecast', // 唯一 id
        name: '水文预报模型',
        category: '水利专业模型',
        purpose: '来水预报',
        methods: ['回归', '机理模型'], // 算法标签
        inputs: ['气象数据'],
        outputs: ['来水过程'],
        scope: '全流域', // 可选
        simulator: 'none', // 若该模型挂英雄模拟器: dispatch | flood | cockpit | none
      },
    ],
    knowledgeBases: [
      { id: 'k-plan', name: '预案方案库', purpose: '预案数字化', content: ['抗旱预案'] },
    ],
  },

  /* ───────────────────────── 基础设施（可选） ───────────────────────── */
  infrastructure: {
    sensors: [{ name: '遥测站', count: 624 }],
    networkTopology: '1总调 + 7分调 + N遥测',
    controlStations: 31, // 远控泵站数
    culverts: 214, // 远控放水涵数
    servers: [{ name: '超融合一体机', count: 4 }],
  },

  /* ───────────────────────── 性能需求（可选） ───────────────────────── */
  performance: {
    concurrentUsers: 200,
    responseTimeSec: 3,
    videoResolution: '1080P',
    videoRetentionDays: 30,
    availability: '99%',
    notes: ['其它性能备注'],
  },

  /* ───────────────────────── 安全需求（可选） ───────────────────────── */
  security: {
    controlLevel: '等保三级',
    businessLevel: '等保二级',
    measures: ['防火墙', '日志审计'],
  },

  /* ───────────────────────── 现状问题（可选） ───────────────────────── */
  problems: ['问题1', '问题2'], // 现状与问题页的痛点清单（可批注）

  /* ───────────────────────── 业务模块（可选） ───────────────────────── */
  // 每个业务模块一页。id 必须是 biz-* 枚举值，且与 nav 里的 children id 对应。
  // simulator 字段决定该页是否挂英雄模拟器（dispatch/flood/cockpit）。
  businessModules: [
    {
      id: 'biz-forecast',
      title: '供需水预报与决策',
      ref: '15.5.3.1',
      purpose: '一句话目的',
      subModules: [
        { name: '子模块名', features: [{ name: '功能点', desc: '说明' }] },
      ],
      simulator: 'none',
    },
  ],

  /* ───────────────────────── 报告附图（可选，强烈推荐） ───────────── */
  // 把报告里的工程图截图放到 apps/web/public/figures/，在此引用。
  // src 是运行时相对路径（相对站点根）。图缺失时自动显示样式化占位。
  // ⚠️ 报告图属设计院 IP，已在 .gitignore 排除（apps/web/public/figures/*.png）
  figures: [
    {
      chapterId: 'profile', // 挂到哪个章节页
      src: 'figures/fig-location.png', // public/figures/ 下的文件名
      caption: '图15.1-1 工程位置示意图',
      ref: '15.1.1',
      type: 'map', // map | layout | org | framework | generic（决定占位图样式）
    },
  ],
}

export default templateConfig

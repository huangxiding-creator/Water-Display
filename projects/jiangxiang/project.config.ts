/**
 * 江巷灌区数字孪生平台 — Project configuration.
 *
 * Derived from: 初步设计报告/江巷信息化（第15章）(215-page PDF + 57-table docx).
 * Every number below is traceable to the report via the `ref` fields.
 * Editing this file changes the entire site — that is the product promise.
 */
import type { ProjectConfig } from '@wd/config'

export const jiangxiangConfig: ProjectConfig = {
  schemaVersion: '1.0',
  report: {
    title: '江巷灌区工程初步设计报告（报批稿）',
    chapter: '15 工程信息化',
    sourceFile: '初步设计报告/江巷信息化（第15章）.pdf',
  },

  /* ----------------------------- Branding -------------------------------- */
  brand: {
    systemName: '江巷灌区数字孪生平台',
    shortName: '江巷孪生',
    tagline: 'Jiangxiang Irrigation Digital Twin Platform',
    owner: '定远县江巷灌区管理局 · 肥东县驷马山电灌工程管理处 · 肥东县撮八电灌工程管理处',
    designer: '安徽省水利水电勘测设计研究总院股份有限公司',
    logo: { mark: 'canal' },
    theme: {
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

  /* ----------------------------- Navigation ------------------------------ */
  nav: [
    { id: 'overview', title: '总览大屏', icon: 'dashboard', ref: '15.1' },
    { id: 'profile', title: '工程概况', icon: 'profile', ref: '15.1.1' },
    { id: 'status', title: '现状与问题', icon: 'status', ref: '15.2' },
    { id: 'requirements', title: '需求分析', icon: 'requirements', ref: '15.3' },
    { id: 'framework', title: '总体方案', icon: 'framework', ref: '15.4' },
    {
      id: 'twin-platform',
      title: '数字孪生平台',
      icon: 'twin',
      ref: '15.5.1',
      children: [
        { id: 'data-foundation', title: '数据底板', ref: '15.5.1.1' },
        { id: 'model-library', title: '模型库', ref: '15.5.1.2' },
        { id: 'knowledge-base', title: '知识库', ref: '15.5.1.3' },
      ],
    },
    { id: 'infrastructure', title: '信息化基础设施', icon: 'infra', ref: '15.5.2' },
    {
      id: 'biz-forecast',
      title: '业务应用',
      icon: 'biz',
      ref: '15.5.3',
      children: [
        { id: 'biz-forecast', title: '供需水预报与决策', ref: '15.5.3.1' },
        { id: 'biz-allocation', title: '水资源配置与调度', ref: '15.5.3.2' },
        { id: 'biz-disaster', title: '水旱灾害防御', ref: '15.5.3.3' },
        { id: 'biz-supply', title: '供用水管理', ref: '15.5.3.4' },
        { id: 'biz-engineering', title: '工程管理', ref: '15.5.3.5' },
        { id: 'biz-onemap', title: '灌区一张图', ref: '15.5.3.6' },
        { id: 'biz-monitor', title: '远程集中监控', ref: '15.5.3.7' },
        { id: 'biz-public', title: '水公共服务', ref: '15.5.3.8' },
        { id: 'biz-portal', title: '综合门户', ref: '15.5.3.9' },
        { id: 'biz-chuhe', title: '数字孪生滁河一级站', ref: '15.5.3.10' },
      ],
    },
    { id: 'security', title: '安全与集成', icon: 'security', ref: '15.5.4' },
    { id: 'my-needs', title: '我的需求', icon: 'annotator' },
  ],

  /* ------------------------------ KPIs ----------------------------------- */
  kpis: [
    { label: '灌区总面积', value: '1022', unit: 'km²', icon: 'area' },
    { label: '设计灌溉面积', value: '99.3', unit: '万亩', icon: 'wheat' },
    { label: '城乡供水范围', value: '2468', unit: 'km²', icon: 'water' },
    { label: '渠道', value: '104', unit: '条 / 438.86km', icon: 'canal' },
    { label: '泵站', value: '44', unit: '座', icon: 'pump' },
    { label: '涵闸', value: '95', unit: '处', icon: 'sluice' },
    { label: '感知点位', value: '624', unit: '遥测站', icon: 'sensor' },
    { label: '业务应用', value: '10', unit: '模块', icon: 'module' },
  ],

  /* --------------------------- Engineering ------------------------------- */
  engineering: {
    totalArea: 1022,
    designIrrigationArea: 99.3,
    highlights: [
      '灌溉工程：干渠25条156.89km、支渠79条281.97km；新建渠道290.84km、改建104.02km、利用现有44.00km',
      '引江水源骨干泵站及输水工程：驷马山乌江站、滁河一至四级站增容，新增装机18台/42600kW；新建四级站干渠13.2km',
      '城乡供水水源工程：新建童王提水站+35.5km管道向芝麻水库补水，设计流量1.93m³/s',
      '三大工程：灌溉工程 / 引江水源骨干泵站及输水工程 / 城乡供水水源工程',
    ],
    entities: [
      { name: '水库', count: 13, remark: '江巷、蔡桥、傅光、墩子王、李园、储城、曹冲、湾孙、大余、扫帚坝、岗王、马桥坝、仓西' },
      { name: '泵站', count: 44, remark: '新建22座、改建14座（含骨干泵站增容）' },
      { name: '节制闸', count: 179, remark: '新建' },
      { name: '进水闸', count: 22, remark: '新建' },
      { name: '分水闸', count: 20, remark: '新建' },
      { name: '退(泄)水闸', count: 43, remark: '新建' },
      { name: '渡槽', count: 5, remark: '新建' },
      { name: '倒虹吸', count: 17, remark: '新建' },
      { name: '涵闸(运行监测)', count: 95, remark: '本次接入运行状态监测' },
      { name: '无人机巡检系统', count: 12, remark: '套' },
    ],
    geoPoints: [
      // Video towers (real coords from report table 15.5-x)
      { name: '定远窦岗铁塔', lng: 117.5752, lat: 32.27272, type: 'video-tower', remark: '观测江巷水库，50m/125km' },
      { name: '定远蔡桥水库铁塔', lng: 117.6376, lat: 32.35921, type: 'video-tower', remark: '观测蔡桥水库，50m/190km' },
      // 12 UAV airports (real coords)
      { name: '江巷水库无人机机场', lng: 117.55779, lat: 32.25896, type: 'uav' },
      { name: '蔡桥水库无人机机场', lng: 117.63048, lat: 32.35101, type: 'uav' },
      { name: '墩子王水库无人机机场', lng: 117.78342, lat: 32.25906, type: 'uav' },
      { name: '郭集二级站无人机机场', lng: 117.51056, lat: 32.21949, type: 'uav' },
      { name: '蒋集一级站无人机机场', lng: 117.48266, lat: 32.28452, type: 'uav' },
      { name: '湾孙水库无人机机场', lng: 117.51481, lat: 32.3751, type: 'uav' },
      { name: '三官站无人机机场', lng: 117.54959, lat: 32.33872, type: 'uav' },
      { name: '大余水库无人机机场', lng: 117.56731, lat: 32.45836, type: 'uav' },
      { name: '岗王水库无人机机场', lng: 117.66778, lat: 32.35974, type: 'uav' },
      { name: '马桥坝无人机机场', lng: 117.71404, lat: 32.39328, type: 'uav' },
      { name: '付光水库无人机机场', lng: 117.63407, lat: 32.16321, type: 'uav' },
      { name: '滁河一级站无人机机场', lng: 117.90645, lat: 31.92523, type: 'uav' },
      // Key reservoirs
      { name: '江巷水库', lng: 117.56, lat: 32.27, type: 'reservoir', remark: '大型，灌区核心水源' },
      { name: '蔡桥水库', lng: 117.63, lat: 32.36, type: 'reservoir' },
      { name: '墩子王水库', lng: 117.78, lat: 32.26, type: 'reservoir' },
      { name: '湾孙水库', lng: 117.51, lat: 32.38, type: 'reservoir' },
      { name: '大余水库', lng: 117.57, lat: 32.46, type: 'reservoir' },
      { name: '岗王水库', lng: 117.67, lat: 32.36, type: 'reservoir' },
      // Key pump stations
      { name: '滁河一级站', lng: 117.91, lat: 31.93, type: 'pump', remark: '大型，设计流量120m³/s，装机19200kW' },
      { name: '郭集一级站', lng: 117.51, lat: 32.22, type: 'pump' },
      { name: '江庄提水站', lng: 117.9, lat: 31.95, type: 'pump', remark: '设计抽水流量27.0m³/s' },
      // Management offices
      { name: '江巷灌区管理局', lng: 117.57, lat: 32.28, type: 'office', remark: '总调度中心' },
    ],
  },

  /* -------------------------- Twin platform ------------------------------ */
  twinPlatform: {
    dataLevels: [
      { level: 'L1', precision: '影像优于15m / DEM 30m', scope: '复用省级共享平台（全省已汇聚25.2亿条数据）' },
      { level: 'L2', precision: '影像优于2m', scope: '灌区1022km²数据底板 + 天然河道水下地形' },
      { level: 'L3', precision: '倾斜模型优于3cm / BIM LOD3.0', scope: '5个泵站工程倾斜模型与BIM' },
    ],
    dataCategories: [
      { name: '基础数据', count: 10, remark: '渠道/泵站/涵闸/桥梁/水库/取水口/行政区划/土地利用/河流湖泊/交通' },
      { name: '水情监测', count: 624, remark: '实时更新' },
      { name: '雨情监测', count: 27 },
      { name: '墒情监测', count: 18 },
      { name: '工情监测', count: 139, remark: '44泵站+95涵闸' },
      { name: '视频监测', count: 77, remark: '铁塔2+低点75' },
      { name: '工程安全监测', count: 46, remark: '泵站27+进水闸4+节制闸11+渡槽4' },
    ],
    models: [
      {
        id: 'm-hydroforecast',
        name: '水文预报模型',
        category: '水利专业模型',
        purpose: '灌溉供水与防洪调度决策的重要依据；覆盖13座水库来水、渠道来水、省厅已建模型调用',
        methods: ['气象模式', '逐步回归', '多元回归', '周期均值叠加', '自回归', '小波分析自回归', '机理驱动+数据驱动'],
        inputs: ['气象数据', '水文数据', '下垫面数据'],
        outputs: ['3~7天日入库中期预报', '旬/月入库预报', '渠道三时间尺度来水'],
        scope: '13座水库 + 干支渠；GB/T 22482-2008（水位/流量误差<10%）',
        simulator: 'none',
      },
      {
        id: 'm-demand',
        name: '需水预测模型',
        category: '水利专业模型',
        purpose: '预测农业灌溉/城乡/生态三类需水，为供需平衡与优化调度提供输入',
        methods: ['水稻各生育期上下限法', '人均日生活用水量法', 'FAO-56 作物需水'],
        inputs: ['气象', '墒情', '种植结构', '人口产业'],
        outputs: ['需水量计划报表'],
        scope: '直供片/联合灌片/余庄片/八龙片',
        simulator: 'none',
      },
      {
        id: 'm-hydro',
        name: '水动力学模型',
        category: '水利专业模型',
        purpose: '骨干枢纽为控制节点，分段进行供水渠道水力仿真；分析非恒定流水力响应',
        methods: ['一维恒定流水力模型', '一维非恒定流水力模型', '水位-流量-蓄量关系曲线'],
        inputs: ['渠系拓扑', '水力参数', '泵闸站空间位置与参数'],
        outputs: ['流达时间', '最优响应时间', '过程线'],
        scope: '直供片7段/联合灌片9段/余庄片/八龙片/引江骨干联合调度',
        simulator: 'dispatch',
      },
      {
        id: 'm-alloc',
        name: '水资源配置模型',
        category: '水利专业模型',
        purpose: '基于来水预报与需水预测，构建典型调度情景集合，求解不同来水/用水情景最优配置',
        methods: ['年调度模型', '典型年(丰/平/枯)情景集合', '月步长优化'],
        inputs: ['水文预报结果', '需水预测结果', '灌溉需水计划'],
        outputs: ['年/月/旬配置方案', '分区配水'],
        scope: '6分区：驷马山骨干/直供片/联合灌片/余庄片/八龙片/水源联通',
        simulator: 'dispatch',
      },
      {
        id: 'm-joint',
        name: '输配水联合调度模型',
        category: '水利专业模型',
        purpose: '任意时刻任意位置水位流量；支持常规与应急调度方案预演',
        methods: ['优化目标：配水时间最短+调度水量最少'],
        inputs: ['配置结果', '水动力结果'],
        outputs: ['调度方案', '3D动态仿真'],
        scope: '郭集片示范区',
        simulator: 'dispatch',
      },
      {
        id: 'm-flood',
        name: '防洪调度模型',
        category: '水利专业模型',
        purpose: '江巷水库及下游西/中/东干渠防洪；推求淹没范围/水深/历时',
        methods: ['洪水频率情景集合', '区间回水计算', '水面线推算'],
        inputs: ['水库实时态', '洪水监测'],
        outputs: ['最大可能淹没范围', '淹没水深', '淹没历时', '防洪调度方案对比'],
        scope: '江巷水库 + 西/中/东干渠',
        simulator: 'flood',
      },
      {
        id: 'm-pump',
        name: '泵站经济运行模型',
        category: '水利专业模型',
        purpose: '既有设备条件下经济合理运行，提高效率、降低抽水成本',
        methods: ['机组性能曲面', '流量-扬程-最优效率曲面'],
        inputs: ['总调水量', '调度周期', '上下游水位', '设计流量'],
        outputs: ['最优流量分配', '非设计工况最优效率'],
        scope: '滁河一级站',
        simulator: 'cockpit',
      },
      {
        id: 'm-safety',
        name: '工程安全监测模型',
        category: '工程安全监测模型',
        purpose: '基于监测量的三级安全评价体系',
        methods: ['多元线性逐步回归', '全回归', '偏最小二乘回归'],
        inputs: ['环境量', '结构变形', '渗流', '应力应变'],
        outputs: ['三级评价：正常/基本正常/局部异常/严重异常（险情）'],
        scope: '13中型泵站+1大型+4进水闸+11节制闸+4渡槽',
        simulator: 'none',
      },
      {
        id: 'm-ai-vision',
        name: '智能识别模型',
        category: '智能识别模型',
        purpose: '24小时智能监测；视频与泵站三维场景融合',
        methods: ['边缘检测(表盘识数)', '指示灯状态识别', '液位识别', '音频边缘算法仓'],
        inputs: ['视频', '振动/温度/声音'],
        outputs: ['实时监测与预警', '运维优化'],
        scope: '全灌区视频点位',
        simulator: 'none',
      },
      {
        id: 'm-sim-engine',
        name: '数字模拟仿真引擎',
        category: '数字模拟仿真引擎',
        purpose: '数据接入与融合/场景管理/可视化渲染/仿真设计/三维场景优化',
        methods: ['本地高渲染+在线云渲染', 'BIM/倾斜轻量化', '物理驱动', '碰撞检测'],
        inputs: ['SHP/TIFF/MAX/FBX/RVT/IFC/OSGB/3DTiles/WMTS'],
        outputs: ['实时渲染场景', '流场动态交互', '四预过程模拟'],
        scope: '全场景',
        simulator: 'none',
      },
      {
        id: 'm-remote-sensing',
        name: '地面标定/遥感监测',
        category: '地面标定',
        purpose: '为遥感作物结构识别提供真值；水稻面积/塘坝蓄水/作物耗水',
        methods: ['FAO-56', '无人船测深(0.15-300m)', 'APP周报'],
        inputs: ['气象站', '土壤墒情', '无人船', '人工调查'],
        outputs: ['种植结构', '灌溉面积', '塘坝蓄水', '作物耗水'],
        scope: '5灌片/5个Ⅲ级灌排单元/80个调查点',
        simulator: 'none',
      },
    ],
    knowledgeBases: [
      { id: 'k-plan', name: '预案方案库', purpose: '预案方案数字化管理，提取调度规则与启动条件', content: ['灌区抗旱应急预案', '泵站调度方案', '骨干工程应急抢险预案'] },
      { id: 'k-rule', name: '业务规则库', purpose: '调度方式的逻辑化数字化表达；可组合结构化规则集', content: ['灌溉调度规则', '生态补水规则', '语义逻辑关系'] },
      { id: 'k-history', name: '历史场景库', purpose: '记录旱情调度全过程', content: ['气象水文', '调度决策', '运行过程', '控制对象状态', '调度效果'] },
      { id: 'k-dispatch', name: '调度方案库', purpose: '高效利用水资源+汛期渠道运行安全', content: ['渠首泵站', '分水闸', '节制闸', '泄洪闸科学方案'] },
      { id: 'k-expert', name: '专家经验库', purpose: '专家决策经验挖掘与过程再现', content: ['文字', '公式', '图形图像'] },
      { id: 'k-safety', name: '工程安全知识库', purpose: '风险隐患识别研判+事故案例', content: ['风险隐患类型/因素/频率/处置', '事故案例(工程类型/事故类型/因素/处置)'] },
      { id: 'k-policy', name: '政策法规库', purpose: '防洪/水资源管理调配/工程管理法规', content: ['法规标准化', '政策透明化', '监管执法依据'] },
      { id: 'k-doc', name: '文档知识整编入库', purpose: '双层PDF(图像层+OCR文本层)；多模态文档解析+向量化', content: ['多语言OCR', '向量数据库', '3-5轮采编参数训练'] },
    ],
  },

  /* -------------------------- Infrastructure ----------------------------- */
  infrastructure: {
    sensors: [
      { name: '在线流量监测站', count: 325, remark: 'ADCP/雷达波一体机/电磁管道流量计' },
      { name: '在线水位监测站', count: 299, remark: '雷达水位计' },
      { name: '遥测站合计', count: 624, remark: '组网1:7:624' },
      { name: '涵闸运行状态监测', count: 95, remark: '闸门开度+工况' },
      { name: '视频监控(低点)', count: 75, remark: '高清球机45+双光谱重载云台30' },
      { name: '视频监控(铁塔高点)', count: 2, remark: '50m塔高' },
      { name: '工程安全监测-泵站', count: 27, remark: '13中型+14小1型，配69套16通道MCU' },
      { name: '工程安全监测-闸', count: 15, remark: '进水闸4+节制闸11' },
      { name: '工程安全监测-渡槽', count: 4, remark: '余庄干渠，总长3480m' },
      { name: '无人机机场系统', count: 12, remark: '套' },
    ],
    networkTopology: '1个总调度中心(管理局) + 7个分调度中心；遥测网 1:7:624；通信 4G/GPRS 自报/应答兼容',
    controlStations: 31,
    culverts: 214,
    servers: [
      { name: '超融合一体机', count: 4, remark: '国产C86×2/32核·2.9GHz/DDR5 512G' },
      { name: '关系型数据库服务器', count: 2 },
      { name: 'GPU服务器', count: 5 },
      { name: '物理服务器', count: 2 },
      { name: '备份一体机', count: 1, remark: '≥20TB' },
      { name: 'SCADA/数据库服务器', count: 4 },
      { name: '虚拟服务器合计', count: 40, remark: '总VCPU 560 / 内存2432GB / 数据盘62900GB' },
      { name: '水利专网', count: 20, remark: '条' },
      { name: '数据专线', count: 39, remark: '条' },
    ],
  },

  /* --------------------------- Performance ------------------------------- */
  performance: {
    concurrentUsers: 200,
    responseTimeSec: 3,
    videoResolution: '1080P / ≥400万像素 星光级',
    videoRetentionDays: 30,
    availability: '交流供电稳定性 99%',
    notes: [
      '骨干/核心层端口万兆(10G)，接入层千兆到桌面，视频≥百兆',
      '并发500时一般查询≤5s；简单汇总≤30s；复杂汇总≤10min',
      '防雷接地≤10Ω；太阳能连续工作15天',
      'SOE事件分辨率≤2ms；事故追忆前5s后20s',
    ],
  },

  /* ---------------------------- Security --------------------------------- */
  security: {
    controlLevel: '等保三级',
    businessLevel: '等保二级',
    measures: [
      '防火墙', '日志审计', '数据库审计', '安全监测系统', '漏洞扫描',
      '视频安全准入', '病毒防护系统', '入侵防御(IPS)', '主机安全卫士', '工控病毒防护系统',
      '控制专网与业务网物理隔离', '自主可控软硬件适配',
    ],
  },

  /* ----------------------------- Problems -------------------------------- */
  problems: [
    '工程监测要素缺失、多维度监测体系亟待完善：流量测站较少，部分闸站未设水位监测；计算机监控系统老旧。',
    '数据底板、数字孪生平台体系有待完善：仅停留基本数据层面，标准体系与模型支撑尚未建立，急需补建模型库与知识库。',
    '水利应用缺乏"四预"功能体系：业务应用系统尚未建设，需搭建水资源管理调配与应急响应系统。',
    '网络安全防控不足：现有设备与运行环境无法满足数字孪生系统部署要求。',
  ],

  /* ----------------------------- Figures -------------------------------- */
  /* Real report figures, reused in the showcase (files live in public/figures/,
     gitignored as report IP; a stylised placeholder shows when absent). */
  figures: [
    { chapterId: 'profile', src: 'figures/fig-location.png', caption: '图15.1-1 江巷灌区工程位置示意图', ref: '15.1.1', type: 'map' },
    { chapterId: 'profile', src: 'figures/fig-layout.png', caption: '图15.1-2 工程布局图', ref: '15.1.1', type: 'layout' },
    { chapterId: 'profile', src: 'figures/fig-org.png', caption: '图15.1-3 管理机构设置图', ref: '15.1.2', type: 'org' },
    { chapterId: 'framework', src: 'figures/fig-framework.png', caption: '图15.4-1 总体框架图', ref: '15.4.3', type: 'framework' },
  ],

  /* -------------------------- Business modules --------------------------- */
  businessModules: [
    {
      id: 'biz-forecast',
      title: '供需水预报与决策',
      ref: '15.5.3.1',
      purpose: '为灌区水资源配置与调度决策提供基础数据与预测依据',
      subModules: [
        { name: '灌区感知', features: [
          { name: '水情监测', desc: '实时水位/流量，超限声光告警' },
          { name: '雨情监测', desc: '实时雨量，暴雨告警' },
          { name: '墒情监测', desc: '共享墒情，干旱告警' },
          { name: '工情监测', desc: '闸门开度/泵站开停机，动效告警' },
        ]},
        { name: '供需水预报', features: [
          { name: '中长期预报', desc: '旬/月降雨趋势；遥相关因子' },
          { name: '短期来水预报', desc: '日尺度；多模型耦合校正' },
          { name: '需水预测与计划', desc: '四片区三类需水；需水计划报表' },
        ]},
      ],
      simulator: 'none',
    },
    {
      id: 'biz-allocation',
      title: '水资源配置与调度',
      ref: '15.5.3.2',
      purpose: '水资源供需平衡分析、配置、调度预警、预演、预案管理（四预核心承载）',
      subModules: [
        { name: '水资源配置', features: [
          { name: '供需平衡分析', desc: '可供 vs 需水；不足时按分区优化配置' },
          { name: '配置方案', desc: '6分区年/月/旬方案' },
        ]},
        { name: '调度预警', features: [
          { name: '实时监测', desc: '流量/水位/分水口' },
          { name: '智能研判', desc: '黄/红两级预警' },
          { name: '阈值动态调整', desc: '风险概率滚动' },
        ]},
        { name: '调度预演', features: [
          { name: '输配水过程模拟', desc: '六步：启动预演→模型库→仿真→风险→可视化→方案集' },
          { name: '多方案对比评估', desc: '智能遴选+对比+综合评估' },
        ]},
        { name: '调度预案', features: [
          { name: '预案制定', desc: '丰/平/枯/特枯典型年自动生成' },
          { name: '调令跟踪', desc: '确认/审核/下达/执行反馈' },
          { name: '操作票生成', desc: '下达即生成' },
          { name: '统计分析评价', desc: '指标体系/方案评价/报表' },
        ]},
      ],
      simulator: 'dispatch',
    },
    {
      id: 'biz-disaster',
      title: '水旱灾害防御',
      ref: '15.5.3.3',
      purpose: '灌区防汛抗旱推演与仿真模拟',
      subModules: [
        { name: '灌区防汛', features: [
          { name: '汛情预报', desc: '未来7天小时级滚动；13水库+河道+干支渠' },
          { name: '汛险预警', desc: '多级告警规则' },
          { name: '汛情预演', desc: '规则库调度预演+淹没仿真预演' },
          { name: '防汛预案', desc: '预演结果生成调令' },
        ]},
        { name: '旱灾防御', features: [
          { name: '旱情监测评估', desc: '特大红/严重橙/中度黄/轻度蓝四级' },
          { name: '旱情预警', desc: '多源融合多维评估' },
          { name: '抗旱调度/预案', desc: '复用配置与调度模块' },
        ]},
      ],
      simulator: 'flood',
    },
    {
      id: 'biz-supply',
      title: '供用水管理',
      ref: '15.5.3.4',
      purpose: '水费营收、供水成本利润核算、重点区域效益分析',
      subModules: [
        { name: '灌溉用水管理', features: [
          { name: '水量统计', desc: '年/月/旬/日枢纽及关键断面' },
          { name: '水量平衡计算', desc: '计划 vs 实抽；渠道损耗分析' },
        ]},
        { name: '智能报表', features: [{ name: '标准格式报表', desc: '分类汇总归档；历史对比' }] },
        { name: '用水评价', features: [
          { name: '水费统计', desc: '营收/支出/公告' },
          { name: '费用分析', desc: '调水成本/利润/效益' },
        ]},
      ],
      simulator: 'none',
    },
    {
      id: 'biz-engineering',
      title: '工程管理',
      ref: '15.5.3.5',
      purpose: '泵站/涵闸/河道等建筑物安全监测与运行管理',
      subModules: [
        { name: '工程安全监测', features: [
          { name: '监测信息管理', desc: '整编/分析/展示' },
          { name: '预警分析', desc: '多级预警/发布/查询/处置' },
          { name: '风险分析', desc: '事件树/故障树/AHP/SVM/BP神经网络分级' },
          { name: '综合查询', desc: '温度等值线/渗流等势线/分布图/相关图/过程线' },
          { name: '报表管理', desc: '自定义模板/导出/打印' },
        ]},
        { name: '工程运行管理', features: [
          { name: '日常巡查', desc: '无人机自动化巡检' },
          { name: '设备管理', desc: '二维码一机一码' },
          { name: '维修/安全/物资/流程', desc: '线下转线上' },
        ]},
      ],
      simulator: 'none',
    },
    {
      id: 'biz-onemap',
      title: '灌区一张图',
      ref: '15.5.3.6',
      purpose: '统一GIS空间数据可视化平台（空间中枢）',
      subModules: [
        { name: '基础底图', features: [
          { name: '多源地图', desc: '天地图/百度/ArcGIS/超图；2D/3D切换' },
          { name: '遥感卷帘对比', desc: '多时相影像卷帘/透明度变换' },
        ]},
        { name: '三维场景', features: [
          { name: '全场景漫游', desc: '自定义飞行航线' },
          { name: '实时监测', desc: '水位/流量/视频/开机数/扬程' },
          { name: '运行模拟', desc: '泵闸开闭仿真' },
        ]},
        { name: '示范区三维', features: [
          { name: 'BIM场景', desc: '设备点击/散点定位/指标曲线' },
          { name: '时空穿梭', desc: '任意历史时刻回放' },
          { name: '孪生场景联动', desc: '视角自动切换' },
        ]},
      ],
      simulator: 'none',
    },
    {
      id: 'biz-monitor',
      title: '远程集中监控系统',
      ref: '15.5.3.7',
      purpose: '31座直属泵站+214处放水涵的远程集中监控/调节/运维/诊断/仿真培训',
      subModules: [
        { name: '驾驶舱', features: [{ name: '工程全貌可视化', desc: '状态/生产/分析/简报/操作流' }] },
        { name: '运行监视', features: [{ name: '实时态', desc: '机组/振摆/辅助/供配电/保护/SNMP/时钟同步' }] },
        { name: '实时控制调节', features: [{ name: '选择-确认-执行', desc: '软硬件防误闭锁；视频联动' }] },
        { name: '记录报告', features: [{ name: 'SOE≤2ms', desc: '事故追忆前5s后20s' }] },
        { name: '运维/诊断/仿真培训', features: [{ name: '全生命周期', desc: '缺陷/工时/培训' }] },
      ],
      simulator: 'cockpit',
    },
    {
      id: 'biz-public',
      title: '水公共服务',
      ref: '15.5.3.8',
      purpose: '行政办公管理与电子文件管理（单轨制归档）',
      subModules: [
        { name: '行政办公', features: [
          { name: '值班考勤', desc: '排班/签到/统计/交接班' },
          { name: '公文报表', desc: '模板/电子台账' },
          { name: '资料共享/通讯录', desc: '个人/组织/同事共享' },
        ]},
        { name: '电子文件管理', features: [
          { name: '流程审批', desc: '电子签名/签章/代理' },
          { name: '档案整编', desc: '自动计算档号；DA/T 48-2009 XML封装' },
          { name: '数据汇总查询', desc: '归档进度/汇总表单' },
        ]},
      ],
      simulator: 'none',
    },
    {
      id: 'biz-portal',
      title: '综合门户',
      ref: '15.5.3.9',
      purpose: '统一登录/身份/权限/待办；PC+移动门户',
      subModules: [
        { name: '工程数字门户', features: [{ name: '统一入口', desc: '待办/提醒/新闻/公告推送' }] },
        { name: '移动门户', features: [
          { name: '掌上一张图', desc: 'WebAPP+企业微信；GIS+视频+站点' },
          { name: '综合预警', desc: '水雨情/泵闸/设备/安全' },
          { name: '移动巡查', desc: '任务/上报' },
        ]},
      ],
      simulator: 'none',
    },
    {
      id: 'biz-chuhe',
      title: '数字孪生滁河一级站',
      ref: '15.5.3.10',
      purpose: '滁河一级泵站专题孪生：统览/智能调度/巡查管理',
      subModules: [
        { name: '泵站统览', features: [
          { name: 'BIM场景', desc: '高精度BIM，机组模型可拆解为关键部件' },
          { name: '时空穿梭', desc: '历史时刻回放' },
          { name: '孪生场景联动', desc: '视角自动切换' },
        ]},
        { name: '泵站智能调度', features: [
          { name: '经济运行方案计算', desc: '泵站经济运行模型，能耗最小化' },
          { name: '黄/红预警', desc: '智能研判' },
          { name: '指令执行/引水量统计', desc: '跟踪/查询/统计/操作票' },
        ]},
        { name: '巡查管理', features: [
          { name: '机组6模块', desc: '监测/分析/诊断/报警/评估+安全分析预测' },
        ]},
      ],
      simulator: 'cockpit',
    },
  ],
}

export default jiangxiangConfig

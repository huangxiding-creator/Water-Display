# 🌊 Water-Display — 水利数字孪生快速展示平台

> **把一份水利工程初步设计报告的「信息化 / 数字孪生」章节，变成一个可交互、可批注、拷走即开的专业级 Web 展示平台。**
> 让业主 10 分钟看懂自己的需求，让软件公司拿去投标汇报。

[![CI](https://github.com/huangxiding-creator/Water-Display/actions/workflows/ci.yml/badge.svg)](https://github.com/huangxiding-creator/Water-Display/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org/)

---

## 这是什么？

很多新建大中型水利工程（灌区 / 水库 / 水利枢纽）的初步设计报告里，都有一章 **工程信息化 / 数字孪生**。
这一章非常专业、非常厚（动辄 200+ 页），业主单位很难读懂；而真正开发一个数字孪生平台周期极长，
业主在早期根本看不到自己要买到什么。**沟通成本高、需求说不清、投标讲不透。**

**Water-Display** 解决的就是这个问题：

```
 初步设计报告（docx/pdf）          业主/设计院/软件公司
        │                                  │
        ▼                                  ▼
 ┌──────────────┐   report-to-frb    ┌──────────────┐
 │  report-to-  │ ───────────────▶   │ project.     │
 │  frb 编译器   │   抽取章节/表格    │ config.ts    │
 └──────────────┘                    └──────┬───────┘
                                            │ 一键生成
                                            ▼
                                   ┌──────────────────┐
                                   │  可交互展示平台    │  ← 双击 index.html 即开
                                   │  · 章节导航       │
                                   │  · mock 仪表盘    │
                                   │  · 3 个英雄模拟器 │
                                   │  · 需求批注+导出   │
                                   └──────────────────┘
```

它**不是真实运行的生产系统**，而是一个**需求沟通工具** —— 把报告可视化、可交互、可批注。

## ✨ 核心特性

- **配置驱动生成器**：一个 `project.config.ts` + 资源文件夹 → 一个完整站点；换项目只换配置
- **报告→需求库编译器**：`tools/report-to-frb` 自动抽取 docx 章节结构与表格，起草配置
- **活目录导航**：站点导航 = 报告章节结构（业主所见即报告）
- **9 + 1 业务模块全覆盖**：供需水预报、水资源配置调度、水旱灾害防御、供用水管理、工程管理、灌区一张图、远程监控、水公共服务、综合门户 + 数字孪生滁河一级站
- **3 个英雄级可交互模拟器**：
  - 🎛 **四预调度演练** — 选典型年 → 调配水权重 → 看保证率/能耗/预警
  - 🌊 **洪水淹没预演** — 选暴雨频率 → 播放 7 天水位 → 看淹没热力图
  - ⚙️ **泵站驾驶舱** — 远控机组 → 注入故障 → 看三级安全评价 + SOE 事件流
- **需求批注闭环**：业主在任意功能上标"需要/修改/不要/提问"，一键导出 JSON/Markdown 变更清单
- **三档便携**：
  - 🅰 单文件 `index.html`（双击即开，零依赖）
  - 🅱 `start.bat` / `start.sh` 一键启动（便携 http 服务器）
  - 🅲 Tauri 桌面 App（`.exe` / `.msi`，原生窗口）
- **🤖 AI 报告问答助手**：嵌入式 GLM（智谱）助手，用报告做知识库，业主问"什么是 L2 数据底板"即答（免费 `glm-4.5-flash`，可切 `glm-5.2`）
- **🗺 灌区一张图**：Leaflet 真实 GIS，27 个工程要素真实经纬度（水库/泵站/铁塔/无人机机场），图层切换
- **🏭 BIM 机组拆解**：Three.js 程序化滁河一级站，6 台机组可拆解为电机/主轴/叶轮/蜗壳
- **品牌身份系统**：项目名 → 配色 + 字体 + 自动 SVG Logo
- **生产级工程**：TypeScript 严格模式、组件化、ECharts 主题统一、CI/CD、零 `console.log`

## 🚀 快速开始

### 环境要求

- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)

### 开发

```bash
pnpm install
pnpm dev          # 启动开发服务器 http://localhost:5173
```

### 构建

```bash
pnpm build:web                 # 多文件构建（dist/）
pnpm --filter @wd/web build:static   # 单文件构建（dist/index.html，双击即开）
```

### 演示交付（拷走即开）

```bash
pnpm --filter @wd/web build:static
# 把 apps/web/dist/ 整个文件夹拷给业主，双击 index.html 即可
# 或双击 apps/web/start.bat （Windows）/ ./start.sh （macOS/Linux）

# 桌面 App（原生窗口，第三档便携）
pnpm --filter @wd/web tauri build      # 产出 .exe / .msi
```

> 演示账号：任意账号密码即可进入（这是展示平台，非真实系统）。

### AI 报告问答助手

平台右下角悬浮 🤖 按钮，业主可用自然语言提问。默认用智谱 **GLM-4.5-Flash**（免费）。
配置：在 AI 面板的 ⚙ 设置中粘贴智谱 API Key（仅存本机 localStorage，不上传），或复制 `.env.example` 为 `.env.local` 填入开发用 Key。需要更强能力时切换 `glm-5.2`（收费）。
获取免费 Key：https://bigmodel.cn

## 📂 项目结构

```
Water-Display/
├── apps/web/                # Vue 3 SPA（展示平台本体）
│   ├── src/
│   │   ├── pages/           # 登录页 + 总览 + 章节/业务页面
│   │   ├── components/      # 面板/KPI/图表/批注/Logo
│   │   ├── components/simulators/  # 3 个英雄模拟器
│   │   ├── stores/          # 批注状态（localStorage）
│   │   ├── composables/     # 主题/ECharts
│   │   └── data/            # 项目配置入口
│   ├── start.bat / start.sh # 一键启动
│   └── serve.mjs            # 零依赖静态服务器
├── packages/config/         # @wd/config — zod 配置 Schema（单一真理源）
├── projects/jiangxiang/     # @wd/project-jiangxiang — 首个实例的配置+数据
├── tools/report-to-frb/     # 报告→FRB 编译器（Python，吃 docx/pdf）
├── docs/                    # 功能需求分解（FRB）等文档
└── .github/workflows/       # CI
```

## ➕ 新增一个水利工程项目

1. 运行编译器起草配置：
   ```bash
   pip install -r tools/report-to-frb/requirements.txt
   python tools/report-to-frb/docx_extract.py path/to/报告.docx
   ```
2. 仿照 `projects/jiangxiang/project.config.ts`，填一份新的 `projects/<工程名>/project.config.ts`
3. 在 `apps/web/src/data/project.ts` 切换导入
4. `pnpm build:static` → 得到该工程的展示平台

## 🛠 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Vue 3 + TypeScript + Vite |
| 状态 | Pinia |
| 图表 | Apache ECharts 5 |
| GIS 一张图 | Leaflet（真实坐标，离线降级）|
| 3D / BIM | Three.js（程序化机组拆解）|
| AI | 智谱 GLM-4.5-Flash（免费）/ GLM-5.2 |
| 桌面 | Tauri 2（原生窗口）|
| 便携打包 | vite-plugin-singlefile |
| 配置校验 | Zod |
| CI | GitHub Actions |

## 📖 文档

- [PROPOSAL.md](PROPOSAL.md) — 完整提案（含 100× 路径、技术决策、路线图）
- [docs/REQUIREMENTS_BREAKDOWN.md](docs/REQUIREMENTS_BREAKDOWN.md) — 江巷灌区报告 200+ 条功能需求分解

## 🗺 路线图

- ✅ **M0 地基**：monorepo / 配置 Schema / 品牌 / 登录 / 主框架 / CI
- ✅ **M1 内容**：章节页 / 总览大屏 / 报告图文复用
- ✅ **M2 业务深度**：9+1 业务模块 + 3 个英雄模拟器 + 需求批注
- ✅ **M3 交付**：单文件构建 / 一键启动 / report-to-frb 编译器
- ✅ **M4 增强**：AI 报告问答助手（GLM）/ Leaflet 灌区一张图 / Three.js BIM 机组拆解 / Tauri 桌面 App
- 🔜 **后续**：真实 .rvt BIM 接入、移动门户、更多水利工程样例

## 📄 许可证

[MIT](LICENSE) — 自由使用、修改、分发。

## 🙏 致谢

- 首个实例「江巷灌区数字孪生平台」基于《江巷灌区工程初步设计报告（报批稿）》第 15 章工程信息化构建，仅用于需求沟通演示。
- 受水利部《数字孪生流域/工程/灌区建设技术大纲》框架启发。

# 配置指南 — 接入第二个水利工程

> 本平台是**配置驱动**的：一个工程 = 一份 `project.config.ts` + 一个资源文件夹。
> 不写代码、不改组件，填完配置就能生成该工程的完整展示站点。
> 本指南教你把一个新的水利工程（灌区/水库/水网/枢纽）的初步设计报告"信息化/数字孪生"章节变成一个可交互展示平台。

---

## 核心理念

```
初步设计报告（docx/pdf）  ──report-to-frb──▶  配置草稿  ──人工校对──▶  project.config.ts
                                                                          │
                                                                          ▼
                                                              apps/web 切换导入
                                                                          │
                                                          build:static ▶ 交付站点
```

**唯一需要改的文件**：新建一份 `projects/<工程名>/project.config.ts`（仿模板填），
再改一行 `apps/web/src/data/project.ts` 的 import。其余代码全部复用。

---

## 5 分钟快速上手（最短路径）

```bash
# 1. 复制模板目录
cp -r projects/_template projects/my-project

# 2. 改 projects/my-project/package.json 的 name 为 @wd/project-my-project

# 3. 用编译器从报告抽取草稿数据（自动）
pip install -r tools/report-to-frb/requirements.txt
python tools/report-to-frb/docx_extract.py 我的报告.docx
# → 生成 .frb.json，里面有全部章节标题 + 57张表，照着填配置

# 4. 编辑 projects/my-project/project.config.ts（仿 projects/jiangxiang 填）

# 5. 校验
pnpm install
pnpm --filter @wd/project-my-project validate   # 不过会明确报错位置

# 6. 切换为当前工程：编辑 apps/web/src/data/project.ts
#    import myProject from '@wd/project-my-project'
#    export const project = myProject

# 7. 预览 / 打包
pnpm dev                                         # 本地预览
pnpm --filter @wd/web build:static               # 产出单文件 index.html
```

---

## 目录结构约定

```
projects/
├── _template/              ← 复制起点（带详尽注释的骨架）
├── jiangxiang/             ← 江巷灌区（参考实例，最完整）
└── my-project/             ← 你的新工程
    ├── package.json        ← name 必须是 @wd/project-<name>
    ├── tsconfig.json
    ├── project.config.ts   ← ★ 核心：填这份
    └── validate.ts         ← 校验脚本

apps/web/public/figures/    ← 报告附图放这里（gitignored，属 IP）
```

> **为什么 chapter id 是固定的？** 水利工程初设报告的"工程信息化"章节遵循水利部
> 《数字孪生流域/工程/灌区建设技术大纲》统一结构（概况/现状/需求/总体方案/孪生平台/
> 基础设施/业务应用/安全），所以 `nav` 的 id 用固定枚举，你只需改 `title` 和 `ref`。

---

## 字段速查（按配置块）

只有 `brand.systemName` 和 `nav` 是必填，其余全部可选（缺失则降级/占位，不会崩）。

### `brand` — 品牌与换肤
| 字段 | 说明 | 示例 |
|---|---|---|
| `systemName` ★ | 全站标题/登录页名 | `'XX灌区数字孪生平台'` |
| `shortName` | 顶栏紧凑名 | `'XX孪生'` |
| `logo.mark` | 自动 logo 图案 | `wave/drop/canal/reservoir/river/mountain` |
| `logo.image` | 现成 logo（覆盖 mark） | `'logo.png'`（放 assets/） |
| `theme.primary` | 主色（改它即全站换肤） | `'#00D4FF'` |
| `theme.primaryDeep` | 深主色 | `'#0066FF'` |

### `nav` — 章节导航（= 报告目录）
- 顶层项 + 可选 `children`（二级菜单）
- `id` 必须用[固定枚举](../packages/config/src/schema.ts)（`overview`/`profile`/.../`biz-*`）
- `title` 任意，`ref` 填报告章节号（如 `'15.5.3.2'`）
- 不需要的业务模块直接从 children 删掉即可（页面不会生成）

### `kpis` — 总览大屏指标卡
`{ label, value(字符串), unit?, icon? }`，会渲染成总览页顶部的指标网格。

### `engineering` — 工程概况
- `totalArea` / `designIrrigationArea`：数字，用于概况页文字
- `highlights`：字符串数组，总览页"三大工程"那类条目
- `entities`：`{ name, count, remark? }`，建筑物清单表
- `geoPoints` ★：`{ name, lng, lat, type, remark? }` —— **一张图的真实坐标点**，type 决定图标颜色（reservoir/pump/sluice/canal/video-tower/uav/monitor/office）

### `twinPlatform` — 数字孪生平台
- `dataLevels`：L1/L2/L3 精度与范围（数据底板页的交互探索器用）
- `dataCategories`：数据资源类别与数量
- `models`：模型卡片，每张含 `id/name/category/purpose/methods/inputs/outputs/scope/simulator`
  - `simulator` 字段：若该模型挂英雄模拟器填 `dispatch`/`flood`/`cockpit`，否则 `none`
- `knowledgeBases`：知识库卡片 `{ id, name, purpose, content[] }`

### `infrastructure` — 基础设施
- `sensors`：感知设备清单（用于感知图 + 拓扑汇总）
- `networkTopology`：拓扑文字（如 `'1:7:624'`）
- `controlStations` / `culverts`：远控泵站/放水涵数量

### `performance` / `security` — 需求与安全
- `performance`：`concurrentUsers`/`responseTimeSec` 等会驱动需求页的**仪表盘**
- `security.controlLevel`：`'等保三级'`，显示在框架图侧带与安全页

### `businessModules` — 业务应用页（每模块一页）
```ts
{
  id: 'biz-allocation',          // 必须是 biz-* 枚举，且与 nav children 对应
  title: '水资源配置与调度',
  ref: '15.5.3.2',
  purpose: '一句话目的',
  subModules: [{ name, features: [{ name, desc }] }],
  simulator: 'dispatch',          // 挂英雄模拟器；none 则用 BizVisual 通用可视化
}
```
- 5 个模块（forecast/supply/engineering/public/portal）自带**互动可视化**（站点/年份/时期切换），无需额外配置
- 3 个模块（allocation/disaster/monitor）自带**英雄模拟器**

### `figures` — 复用报告附图（强烈推荐）
```ts
{ chapterId: 'profile', src: 'figures/fig-location.png', caption: '图15.1-1 ...', ref: '15.1.1', type: 'map' }
```
- 把报告图截图放到 `apps/web/public/figures/`，在此用 `src: 'figures/文件名.png'` 引用
- `type`：`map/layout/org/framework/generic`，决定**图缺失时的样式化占位**
- ⚠️ 报告图属设计院 IP，`public/figures/*.png` 已 gitignore，**不会进公开仓库**；开源版显示占位，你的本地版显示真图

---

## 品牌与换肤

改 `brand.theme` 两个主色即全站换肤（所有组件、图表、地图标记都走 CSS 变量）：
```ts
theme: { primary: '#00D4FF', primaryDeep: '#0066FF', /* 其余继承默认 */ }
```
Logo 默认按 `mark` 关键字自动生成 SVG（无需图片）。若有现成 logo：
```ts
logo: { image: 'logo.png' }   // 放 projects/<name>/assets/logo.png
```

---

## 校验与排错

```bash
pnpm --filter @wd/project-<name> validate
```
zod 校验不过时会**精确定位**出错字段。常见错误：
- `id` 拼错（必须是枚举值，如 `biz-allocation` 不是 `biz-alloc`）
- `nav` 里的 children `id` 与 `businessModules` 的 `id` 对不上
- `count` 填成字符串（应为数字）
- `geoPoints` 的 `lng/lat` 填成字符串（应为数字）

校验通过但页面不对？`pnpm dev` 看控制台；多数是 import 没切到新工程。

---

## 完整参考实例

[projects/jiangxiang/project.config.ts](../projects/jiangxiang/project.config.ts) 是最完整的真实样例
（215 页报告全量数据：11 模型 / 8 知识库 / 27 真实坐标 / 全部业务模块）。复制它改也行。

[projects/_template/project.config.ts](../projects/_template/project.config.ts) 是带详尽注释的骨架，逐字段说明。

---

## 从报告到配置的建议工作流

1. **抽取**：`python tools/report-to-frb/docx_extract.py 报告.docx` → 得到章节树 + 全部表格
2. **填 nav**：照报告目录改 `title` 和 `ref`
3. **填 engineering**：从报告"工程概况"抄数字（面积/建筑物/坐标）
4. **填 twinPlatform**：照"数字孪生平台"章节填模型/知识库（编译器的表格能帮大忙）
5. **填 businessModules**：照"业务应用"章节，每个子模块一条
6. **截图 figures**：把报告里的工程位置图/布局图/框架图截 PNG 放 `public/figures/`
7. **校验 + 预览 + 打包**

> 一个有报告在手的人，照这个流程 **半天内** 可产出新工程的完整展示站点。

# IDEA_SEED — Water-Display (水利数字孪生快速展示平台)

> Source: `开发初步想法/*.docx` (user voice transcript) + `初步设计报告/江巷信息化（第15章）.pdf` (215 pages, Jiangxiang Irrigation District Ch.15 informatization)
> Generated: 2026-07-31, via Super-Skill V4.1 Idea-Intake

## 1. The Problem (in the user's own words)

When a new large water project (灌区/水库/水利枢纽) is designed, the preliminary design report (初步设计报告) contains a dedicated **工程信息化 / 数字孪生** chapter (e.g. Ch.15). This chapter is:
- written by design institutes (设计院), very technical, hard for owners to digest
- the basis on which software firms bid/build the actual digital-twin platform
- the source of truth for the owner's requirements

**Pain:** the real digital-twin platform takes a very long time to build, so during early communication the owner **cannot see what they will actually get**. They don't even know what they want until they see something concrete. This makes requirement alignment slow, abstract, and error-prone.

## 2. The User's Initial Idea (the "1×")

Build a **web-based display/communication platform** that:
1. Visualizes the contents of the informatization/digital-twin chapter
2. Mirrors the report's structure (工程概况 / 现状 / 需求 / 总体框架 / 数字孪生平台 / 业务应用 / 安全 / 集成)
3. Renders every required business module (供需水预报, 水资源配置与调度, 水旱灾害防御, 工程管理, 灌区一张图, 远程集中监控, 水公共服务, 综合门户 …) with mock data
4. Reuses images/diagrams/screenshots from the report
5. System name configurable (e.g. "江巷灌区数字孪生平台"); auto-generates a logo and matching look
6. Clean, grand (大气), tech-feel (科技感) design
7. **Single-folder portable** — copy to any PC, double-click to run, no external dependencies
8. Generic/reusable for other water projects later

Goal: owners instantly "see" the requirement, give better feedback, and the firm wins the next-stage work.

## 3. What's genuinely good vs. what's missing in the "1×"

**Good:** right problem, right audience, right "show-don't-tell" instinct, correct portability constraint.

**Gaps (the 100× opening):**
- The 1× is "manually build one display site per project" → still slow, still bespoke, doesn't scale
- It's one-way (display) → doesn't *capture* the owner's feedback in a structured way
- Static mockups → owner can't *feel* scenarios like 四预 (forecasting/warning/pre-rehearsal/pre-plan)
- Reusing report images is mentioned but not systematized → fragile
- "Auto logo" mentioned but no design system behind it → inconsistent look across projects

## 4. Domain context (from the Jiangxiang PDF — the seed instance)

The Jiangxiang Ch.15 is a textbook example of 水利部 数字孪生 four-tier framework. It contains, in order:
- 15.1 概述 (工程概况/任务/规模, 建设单位, 指导思想, 编制依据)
- 15.2 信息化建设现状 (省厅/灌区现状, 业务系统, 问题分析)
- 15.3 需求分析 (用户/业务/数据/性能/安全/集成/集约化)
- 15.4 总体方案 (目标/原则/**总体框架图**/建设内容) ← the canonical architecture diagram
- 15.5 建设方案:
  - 15.5.1 数字孪生平台 (数据底板/模型库/知识库) ← 39 pages, the core
  - 15.5.2 信息化基础设施 (感知网/自控/通讯/运行环境/支撑平台)
  - 15.5.3 业务智能应用 (9 modules, ~46 pages)
  - 15.5.4 信息资源共享
  - 15.5.5 网络信息安全 (等保三级)
  - 15.5.6 系统集成与运行保障
  - 15.5.7 工程量清单

This structure is **not unique to Jiangxiang** — it follows 水利部《数字孪生流域/工程/灌区建设技术大纲(试行)》, so the same generator works for any water project.

## 5. Clarification questions (hybrid gate)

The request is mostly clear, but these decisions materially change the proposal. I will present the proposal with **recommended answers baked in**; please confirm or correct at the approval gate.

| # | Question | Why it matters | My recommendation |
|---|----------|----------------|-------------------|
| Q1 | **Automation level**: Should the platform *auto-parse the PDF/Word report* (ML-heavy, error-prone, slow), or use a **structured project config (JSON/YAML)** a human fills in by reading the report (reliable, fast, reusable, version-controllable)? | Pivotal architecture decision — determines whether "run once and generate" is achievable at production quality | **Config-driven.** Optional light PDF-assist later (extract headings/tables as a *draft* config a human edits). Generator reads config → emits site. |
| Q2 | **"Interactive" depth**: (a) navigable + animated charts + mock-data dashboards, (b) also mini scenario simulators (e.g. play a flood/dispatch timeline, drag sliders on water allocation), or (c) fully functional prototypes? | Effort and "wow" factor differ by ~10× | **(b).** Navigable + mock-data dashboards for *every* module + 2–3 hero "scenario simulators" (四预, 水资源配置调度, 工程安全) — enough that owners *feel* the value, not just see screenshots. |
| Q3 | **Offline portability strictness**: strictly `double-click index.html` (file://, pure static, all data inlined, no server), OR allow a **bundled 1-click launcher** (tiny portable http-server + .bat/.sh + optional Electron/Tauri build)? | Some libs (Cesium, fetch of local JSON) misbehave on file:// | **Hybrid:** default = pure-static (works from file://), with a bundled `start.bat`/`start.sh` one-click launcher for the richer Cesium/3D experience. Optional Tauri desktop build later. |
| Q4 | **First-deliverable scope**: build the **generic generator** *and* ship the **Jiangxiang instance** as its canonical showcase, OR just the generator? | Defines what "done" means for this engagement | **Both.** Generator + 江巷灌区数字孪生平台 as the reference project under `projects/`. |

## 6. The seed → 100× leap (preview; full detail in PROPOSAL.md)

1. **Report-to-Platform generator**, not hand-coded site → scales across projects
2. **Config = single source of truth** → versioned, reviewable, diffable across owner meetings
3. **Interactive requirement-alignment layer** → owners annotate modules; export a structured change-list / revised PRD
4. **Scenario simulators** for 四预 → owners *feel* the value
5. **Brand identity system** from project name → consistent look, no per-project design work
6. **Living TOC** auto-mirrors the report chapter → owners see "this is your report, made explorable"
7. **AI Q&A on the report** (optional) → embedded assistant answers owner questions
8. **Open-source, production-grade** → the GitHub-trending water tool nobody has shipped yet

## 7. Target instance

- **System name:** 江巷灌区数字孪生平台 (Jiangxiang Irrigation District Digital Twin Platform)
- **Project location:** 安徽省滁州市/合肥市, 1022 km², 设计灌溉面积 99.3 万亩
- **3 大工程:** 灌溉工程 / 引江水源骨干泵站及输水工程 / 城乡供水水源工程
- **9 业务应用模块** (from 15.5.3) → each becomes an interactive page

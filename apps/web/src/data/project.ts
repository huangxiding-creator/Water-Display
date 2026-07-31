/**
 * Project loader — single point where the active project config is chosen.
 * To ship a different project, swap this import. Everything downstream
 * (brand, nav, pages) reads from here.
 */
import type { ProjectConfig } from '@wd/config'
import jiangxiang from '@wd/project-jiangxiang'

export const project: ProjectConfig = jiangxiang

/** Flatten nav (including children) into an ordered lookup of id → item. */
export const navIndex = new Map(
  (function walk(items: ProjectConfig['nav']): Array<[string, ProjectConfig['nav'][number]]> {
    const out: Array<[string, ProjectConfig['nav'][number]]> = []
    for (const item of items) {
      out.push([item.id, item])
      if (item.children) out.push(...walk(item.children))
    }
    return out
  })(project.nav),
)

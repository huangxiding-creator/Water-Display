/**
 * Applies the active project's brand theme as CSS custom properties on :root.
 * One call at app startup; components reference `var(--wd-color-*)` everywhere.
 */
import { project } from '@/data/project'

const CSS_VAR_MAP = {
  primary: '--wd-primary',
  primaryDeep: '--wd-primary-deep',
  accent: '--wd-accent',
  bgDark: '--wd-bg',
  bgPanel: '--wd-panel',
  textMain: '--wd-text',
  textDim: '--wd-text-dim',
  danger: '--wd-danger',
  warning: '--wd-warning',
  success: '--wd-success',
} as const

export function applyTheme(): void {
  const root = document.documentElement
  const theme = project.brand.theme
  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
    const value = theme[key as keyof typeof theme]
    if (value) root.style.setProperty(cssVar, value)
  }
  root.style.setProperty('--wd-gradient', `linear-gradient(135deg, ${theme.primaryDeep}, ${theme.primary})`)
  document.title = project.brand.systemName
}

/**
 * Shared ECharts theme tokens — every chart reads colors from here so the
 * whole platform reads as one design system. Swap palette in one place.
 */
export const CHART_PALETTE = [
  '#00D4FF',
  '#0066FF',
  '#FFB100',
  '#52C41A',
  '#FF7A45',
  '#B37FEB',
  '#36CFC9',
  '#FF85C0',
  '#FFD666',
  '#95DE64',
]

export const AXIS_STYLE = {
  axisLine: { lineStyle: { color: 'rgba(127,168,208,0.25)' } },
  axisLabel: { color: '#7FA8D0', fontSize: 11 },
  splitLine: { lineStyle: { color: 'rgba(127,168,208,0.1)' } },
  axisTick: { show: false },
} as const

export const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(6,21,40,0.92)',
  borderColor: 'rgba(0,212,255,0.4)',
  borderWidth: 1,
  textStyle: { color: '#E6F2FF', fontSize: 12 },
  extraCssText: 'backdrop-filter: blur(8px); border-radius: 6px;',
} as const

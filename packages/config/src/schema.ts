/**
 * @wd/config — Project configuration schema (zod).
 *
 * One `ProjectConfig` fully describes a water-conservancy informatization /
 * digital-twin showcase site. The report compiler emits it; the web app consumes it.
 * Adding a new project = filling one of these. That is the whole product.
 */
import { z } from 'zod'

/* -------------------------------------------------------------------------- */
/*  Branding & theme                                                          */
/* -------------------------------------------------------------------------- */

export const BrandThemeSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#00D4FF'),
  primaryDeep: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#0066FF'),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#FFB100'),
  bgDark: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#0B1E3F'),
  bgPanel: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#0E2A52'),
  textMain: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#E6F2FF'),
  textDim: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#7FA8D0'),
  danger: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#FF4D4F'),
  warning: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#FAAD14'),
  success: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#52C41A'),
})
export type BrandTheme = z.infer<typeof BrandThemeSchema>

export const LogoSpecSchema = z.object({
  /** Kind of geometric mark to synthesize when no asset is provided. */
  mark: z
    .enum(['wave', 'drop', 'canal', 'reservoir', 'river', 'mountain', 'custom'])
    .default('wave'),
  /** Optional inline SVG (overrides generated mark). */
  svg: z.string().optional(),
  /** Optional image asset path relative to project assets. */
  image: z.string().optional(),
})
export type LogoSpec = z.infer<typeof LogoSpecSchema>

export const BrandSchema = z.object({
  /** Full display name, e.g. "江巷灌区数字孪生平台". */
  systemName: z.string().min(1),
  /** Short name for compact UI, e.g. "江巷孪生". */
  shortName: z.string().optional(),
  /** English subtitle / tagline. */
  tagline: z.string().optional(),
  /** Owner / construction unit shown in footer & about. */
  owner: z.string().optional(),
  /** Design institute that produced the report. */
  designer: z.string().optional(),
  logo: LogoSpecSchema.default({ mark: 'wave' }),
  theme: BrandThemeSchema.default({}),
})
export type Brand = z.infer<typeof BrandSchema>

/* -------------------------------------------------------------------------- */
/*  Navigation / chapters                                                     */
/* -------------------------------------------------------------------------- */

export const ChapterIdSchema = z.enum([
  'overview',
  'profile',
  'status',
  'requirements',
  'framework',
  'twin-platform',
  'data-foundation',
  'model-library',
  'knowledge-base',
  'infrastructure',
  'biz-forecast',
  'biz-allocation',
  'biz-disaster',
  'biz-supply',
  'biz-engineering',
  'biz-onemap',
  'biz-monitor',
  'biz-public',
  'biz-portal',
  'biz-chuhe',
  'security',
  'my-needs',
])
export type ChapterId = z.infer<typeof ChapterIdSchema>

/** Manually declared to support the recursive children reference below. */
export interface NavItem {
  id: ChapterId
  title: string
  /** Report section reference, e.g. "15.5.3.2". */
  ref?: string | undefined
  icon?: string | undefined
  children?: NavItem[] | undefined
}

export const NavItemSchema: z.ZodType<NavItem> = z.object({
  id: ChapterIdSchema,
  title: z.string(),
  ref: z.string().optional(),
  icon: z.string().optional(),
  children: z.lazy(() => z.array(NavItemSchema)).optional(),
})

/* -------------------------------------------------------------------------- */
/*  Engineering entities                                                      */
/* -------------------------------------------------------------------------- */

export const NamedCountSchema = z.object({
  name: z.string(),
  count: z.number().int().nonnegative(),
  remark: z.string().optional(),
})
export type NamedCount = z.infer<typeof NamedCountSchema>

export const GeoPointSchema = z.object({
  name: z.string(),
  lng: z.number(),
  lat: z.number(),
  type: z
    .enum([
      'reservoir',
      'pump',
      'sluice',
      'canal',
      'video-tower',
      'uav',
      'monitor',
      'office',
    ])
    .optional(),
  remark: z.string().optional(),
})
export type GeoPoint = z.infer<typeof GeoPointSchema>

export const EngineeringSchema = z.object({
  totalArea: z.number().optional(),
  designIrrigationArea: z.number().optional(),
  /** Reservoirs, pump stations, sluices, canals — each with count. */
  entities: z.array(NamedCountSchema).default([]),
  /** Geo points for the one-map view (subset; full set lives in data files). */
  geoPoints: z.array(GeoPointSchema).default([]),
  /** Free-form highlights, e.g. "三大工程". */
  highlights: z.array(z.string()).default([]),
})
export type Engineering = z.infer<typeof EngineeringSchema>

/* -------------------------------------------------------------------------- */
/*  Digital-twin platform                                                     */
/* -------------------------------------------------------------------------- */

export const ModelCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  purpose: z.string(),
  methods: z.array(z.string()).default([]),
  inputs: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
  scope: z.string().optional(),
  /** Hero simulator coupling, if any. */
  simulator: z
    .enum(['dispatch', 'flood', 'cockpit', 'none'])
    .default('none'),
})
export type ModelCard = z.infer<typeof ModelCardSchema>

export const KnowledgeCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  purpose: z.string(),
  content: z.array(z.string()).default([]),
})
export type KnowledgeCard = z.infer<typeof KnowledgeCardSchema>

export const TwinPlatformSchema = z.object({
  dataLevels: z
    .array(
      z.object({
        level: z.enum(['L1', 'L2', 'L3']),
        precision: z.string(),
        scope: z.string(),
      }),
    )
    .default([]),
  dataCategories: z.array(NamedCountSchema).default([]),
  models: z.array(ModelCardSchema).default([]),
  knowledgeBases: z.array(KnowledgeCardSchema).default([]),
})
export type TwinPlatform = z.infer<typeof TwinPlatformSchema>

/* -------------------------------------------------------------------------- */
/*  Infrastructure & specs                                                    */
/* -------------------------------------------------------------------------- */

export const InfrastructureSchema = z.object({
  sensors: z.array(NamedCountSchema).default([]),
  networkTopology: z.string().optional(),
  controlStations: z.number().int().nonnegative().optional(),
  culverts: z.number().int().nonnegative().optional(),
  servers: z.array(NamedCountSchema).default([]),
})
export type Infrastructure = z.infer<typeof InfrastructureSchema>

export const PerformanceSchema = z.object({
  concurrentUsers: z.number().optional(),
  responseTimeSec: z.number().optional(),
  videoResolution: z.string().optional(),
  videoRetentionDays: z.number().optional(),
  availability: z.string().optional(),
  notes: z.array(z.string()).default([]),
})
export type Performance = z.infer<typeof PerformanceSchema>

export const SecuritySchema = z.object({
  /** 等保级别, e.g. "等保三级" for control network. */
  controlLevel: z.string().default('等保三级'),
  businessLevel: z.string().default('等保二级'),
  measures: z.array(z.string()).default([]),
})
export type Security = z.infer<typeof SecuritySchema>

/* -------------------------------------------------------------------------- */
/*  Business modules                                                          */
/* -------------------------------------------------------------------------- */

export const BizFeatureSchema = z.object({
  name: z.string(),
  desc: z.string().optional(),
})
export type BizFeature = z.infer<typeof BizFeatureSchema>

export const FigureSchema = z.object({
  /** Chapter id this figure belongs to (matches NavItem.id). */
  chapterId: z.string(),
  /** Runtime-relative URL, e.g. 'figures/fig-location.png'. */
  src: z.string(),
  caption: z.string(),
  ref: z.string().optional(),
  /** Controls the stylised fallback shown when the image file is absent. */
  type: z
    .enum(['map', 'layout', 'org', 'framework', 'generic'])
    .default('generic'),
})
export type Figure = z.infer<typeof FigureSchema>

export const BizModuleSchema = z.object({
  id: ChapterIdSchema,
  title: z.string(),
  ref: z.string().optional(),
  purpose: z.string(),
  subModules: z
    .array(
      z.object({
        name: z.string(),
        features: z.array(BizFeatureSchema).default([]),
      }),
    )
    .default([]),
  /** Hero simulator mounted on this page. */
  simulator: z
    .enum(['dispatch', 'flood', 'cockpit', 'none'])
    .default('none'),
})
export type BizModule = z.infer<typeof BizModuleSchema>

/* -------------------------------------------------------------------------- */
/*  Project config (top level)                                                */
/* -------------------------------------------------------------------------- */

export const ProjectConfigSchema = z.object({
  schemaVersion: z.literal('1.0').default('1.0'),
  brand: BrandSchema,
  nav: z.array(NavItemSchema),
  engineering: EngineeringSchema.default({}),
  twinPlatform: TwinPlatformSchema.default({}),
  infrastructure: InfrastructureSchema.default({}),
  performance: PerformanceSchema.default({}),
  security: SecuritySchema.default({}),
  businessModules: z.array(BizModuleSchema).default([]),
  /** Key metrics shown on the overview dashboard. */
  kpis: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        unit: z.string().optional(),
        icon: z.string().optional(),
      }),
    )
    .default([]),
  /** Problem statements from the report's current-state analysis. */
  problems: z.array(z.string()).default([]),
  /** Real figures/images reused from the source report (mapped to chapters). */
  figures: z.array(FigureSchema).default([]),
  /** Free-form report metadata. */
  report: z
    .object({
      title: z.string(),
      chapter: z.string().default('第15章 工程信息化'),
      sourceFile: z.string().optional(),
    })
    .optional(),
})
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>

/**
 * Validate an unknown object as a ProjectConfig; throws a ZodError on mismatch.
 * Use `parseProjectConfig` at build time to fail fast on bad configs.
 */
export function parseProjectConfig(input: unknown): ProjectConfig {
  return ProjectConfigSchema.parse(input)
}

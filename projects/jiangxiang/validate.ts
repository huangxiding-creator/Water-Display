/**
 * Validates the Jiangxiang project config against the zod schema.
 * Run: pnpm --filter @wd/project-jiangxiang validate
 */
import { parseProjectConfig } from '@wd/config'
import { jiangxiangConfig } from './project.config'

try {
  const parsed = parseProjectConfig(jiangxiangConfig)
  console.log(`✅ Jiangxiang config valid.`)
  console.log(`   Brand: ${parsed.brand.systemName}`)
  console.log(`   Nav items: ${parsed.nav.length}`)
  console.log(`   Models: ${parsed.twinPlatform.models.length}`)
  console.log(`   Knowledge bases: ${parsed.twinPlatform.knowledgeBases.length}`)
  console.log(`   Business modules: ${parsed.businessModules.length}`)
  console.log(`   Geo points: ${parsed.engineering.geoPoints.length}`)
} catch (err) {
  console.error('❌ Config invalid:', err)
  process.exit(1)
}

/** Validates the template config against the zod schema. */
import { parseProjectConfig } from '@wd/config'
import { templateConfig } from './project.config'

try {
  const parsed = parseProjectConfig(templateConfig)
  console.log('✅ Template config valid.')
  console.log(`   Brand: ${parsed.brand.systemName}`)
  console.log(`   Nav: ${parsed.nav.length} items | Modules: ${parsed.businessModules.length}`)
} catch (err) {
  console.error('❌ Config invalid:', err)
  process.exit(1)
}

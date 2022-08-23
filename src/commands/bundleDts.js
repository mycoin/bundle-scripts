import { writeFileSync, existsSync } from 'fs-extra'
import { generateDtsBundle } from 'dts-bundle-generator'
import { npmLog } from '../util'

/**
 * generate DTS Bundle
 *
 * @param {String} target
 * @param {String} sourceFile
 * @returns
 */
export default (config, callback) => {
  const { resolvePath, packageJson } = config
  const target = packageJson.typings || packageJson.types
  const sourceFile = resolvePath('src/index.d.ts')

  if (target && existsSync(sourceFile)) {
    const codes = generateDtsBundle([{
      filePath: sourceFile,
      failOnClass: false,
      output: {
        noBanner: true,
      },
    }])
    if (codes) {
      npmLog('info', 'index.d.ts generated')
      writeFileSync(target, codes[0])
    }
  }

  callback()
}

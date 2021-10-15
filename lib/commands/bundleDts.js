const { writeFileSync, existsSync } = require('fs-extra')
const { generateDtsBundle } = require('dts-bundle-generator')
const { npmLog } = require('../util')

/**
 * generate DTS Bundle
 *
 * @param {String} target
 * @param {String} sourceFile
 * @returns
 */
module.exports = (config, callback) => {
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
      npmLog('info', 'generate d.ts bundles...')
      writeFileSync(target, codes[0])
    }
  } else {
    npmLog('info', 'no index.d.ts found, skip...')
  }

  callback()
}

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
      npmLog('info', 'index.d.ts generated')
      writeFileSync(target, codes[0])
    }
  }

  callback()
}

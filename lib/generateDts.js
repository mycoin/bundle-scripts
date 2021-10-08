const { writeFileSync, existsSync } = require('fs-extra')
const { generateDtsBundle } = require('dts-bundle-generator')

/**
 * generate DTS Bundle
 *
 * @param {String} target
 * @param {String} sourceFile
 * @returns
 */
module.exports = (target, sourceFile) => {
  if (!target || !existsSync(sourceFile)) {
    return
  }

  const codes = generateDtsBundle([{
    filePath: sourceFile,
    failOnClass: true,
    output: {
      noBanner: true,
    },
  }])
  writeFileSync(target, codes[0])
}

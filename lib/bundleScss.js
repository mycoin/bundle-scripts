const { Bundler } = require('scss-bundle')
const { writeFileSync, existsSync } = require('fs-extra')

/**
 * generate bundle scss
 *
 * @param {String} target
 * @param {String} sourceFile
 * @returns
 */
module.exports = (target, sourceFile) => {
  if (!existsSync(sourceFile)) {
    return
  }

  new Bundler().bundle(sourceFile).then((value) => {
    writeFileSync(target, value.bundledContent)
  }).catch((error) => {
    throw error
  })
}

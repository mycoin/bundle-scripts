import path from 'path'
import { readdirSync, copySync, mkdirSync, writeJsonSync, readJsonSync } from 'fs-extra'

/**
 * generate DTS Bundle
 *
 * @param {String} target
 * @param {String} sourceFile
 * @returns
 */
export default (config, callback) => {
  const { resolvePath, options } = config
  const dist = process.env.BUILD_DEST || '.build'
  const isDaily = /env=daily/i.test(process.env.BUILD_ARGV_STR)

  if (dist) {
    mkdirSync(dist)
    readdirSync(options.cwd).forEach((filename) => {
      const from = resolvePath(filename)
      const target = path.join(dist, filename)

      if (filename === 'node_modules' || filename === dist) {
        return
      }
      copySync(from, target, {
        recursive: true,
        overwrite: true,
      })
    })
    if (isDaily) {
      const pkgFile = path.join(dist, 'package.json')
      const pkg = readJsonSync(pkgFile)

      pkg.version += '-beta.' + new Date() * 1
      writeJsonSync(pkgFile, pkg, {
        spaces: 2,
      })
    }
  }
  callback()
}

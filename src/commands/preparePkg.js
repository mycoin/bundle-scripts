import path from 'path'
import { readdirSync, copySync, ensureDirSync, writeJsonSync, readJsonSync } from 'fs-extra'

/**
 * generate DTS Bundle
 *
 * @param {String} target
 * @param {String} sourceFile
 * @returns
 */
export default (config, callback) => {
  const { resolvePath, options } = config
  const dist = process.env.BUILD_DEST_DIR

  if (dist && dist.startsWith('/')) {
    ensureDirSync(dist)
    readdirSync(options.cwd).forEach((filename) => {
      const from = resolvePath(filename)
      const target = path.join(dist, filename)

      if (filename === 'node_modules' || target === path.normalize(dist)) {
        return
      }
      copySync(from, target, {
        recursive: true,
        overwrite: true,
      })
    })
    if (/ENV=daily/i.test(process.env.BUILD_ARGV_STR)) {
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

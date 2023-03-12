import path from 'path'
import { readdirSync, copySync, ensureDirSync, writeJsonSync, readJsonSync, emptyDir } from 'fs-extra'

const dist = process.env.BUILD_DEST_DIR
const taskId = process.env.BUILD_TASK_ID
const isDaily = /ENV=daily/i.test(process.env.BUILD_ARGV_STR)

/**
 * generate DTS Bundle
 *
 * @param {String} target
 * @param {String} sourceFile
 * @returns
 */
export default (config, callback) => {
  const { resolvePath, options } = config

  if (dist && dist.startsWith('.')) {
    ensureDirSync(dist)
    emptyDir(dist)
    readdirSync(options.cwd).forEach((filename) => {
      const from = resolvePath(filename)
      const target = path.join(dist, filename)

      if (['node_modules', '.git', dist].indexOf(filename) > -1) {
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

      pkg.version += '-beta.' + (taskId || Date.now())
      writeJsonSync(pkgFile, pkg, {
        spaces: 2,
      })
    }
  }
  callback()
}

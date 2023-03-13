import path from 'path'
import { readdirSync, copySync, ensureDirSync, writeJsonSync, readJsonSync, emptyDir } from 'fs-extra'
import { isCloudBuild } from '../util'

/**
 * generate DTS Bundle
 *
 * @param {String} target
 * @param {String} sourceFile
 * @returns
 */
export default (config, callback) => {
  const { resolvePath, options } = config
  const buildDestDir = process.env.BUILD_DEST_DIR
  const buildTaskId = process.env.BUILD_TASK_ID

  const updateVersion = () => {
    const pkgFile = path.join(buildDestDir, 'package.json')
    const pkg = readJsonSync(pkgFile)
    if (/ENV=daily/i.test(process.env.BUILD_ARGV_STR)) {
      pkg.version += '-beta.' + (buildTaskId || Date.now())
    }
    writeJsonSync(pkgFile, pkg, {
      spaces: 2,
    })
  }

  // 只有开启云构建才需要操作
  if (isCloudBuild()) {
    ensureDirSync(buildDestDir)
    emptyDir(buildDestDir)
    readdirSync(options.cwd).forEach((filename) => {
      const from = resolvePath(filename)
      const target = path.join(buildDestDir, filename)

      if (['node_modules', '.git', buildDestDir].indexOf(filename) > -1) {
        return
      }
      copySync(from, target, {
        recursive: true,
        overwrite: true,
      })
    })
    updateVersion(buildDestDir)
  }
  callback()
}

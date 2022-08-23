import path from 'path'
import { emptyDirSync, mkdirpSync } from 'fs-extra'
import { npmLog } from '../util'

export default (config, callback) => {
  const { paths, options } = config
  const removeDir = (dir) => {
    if (dir && dir.startsWith(options.cwd)) {
      mkdirpSync(path.dirname(dir))
      emptyDirSync(path.dirname(dir))
    }
  }

  npmLog('info', 'clean up...')
  removeDir(paths.dist)
  removeDir(paths.module)
  removeDir(paths.typings)
  callback()
}

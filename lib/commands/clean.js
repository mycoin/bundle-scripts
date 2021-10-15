const path = require('path')
const { emptyDirSync } = require('fs-extra')
const { mkdirpSync } = require('fs-extra')
const { npmLog } = require('../util')

module.exports = (config, callback) => {
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

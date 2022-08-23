import path from 'path'
import { Bundler } from 'scss-bundle'
import { writeFileSync, existsSync } from 'fs-extra'
import { npmLog } from '../util'

export default (config, callback) => {
  const { paths } = config
  const sourceFile = config.resolvePath('src/index.scss')

  if (!existsSync(sourceFile)) {
    callback()
  } else {
    const writeFile = (rel, content) => {
      if (rel && typeof rel === 'string') {
        const dir = path.dirname(rel)
        writeFileSync(path.join(dir, 'index.scss'), content)
      }
    }
    new Bundler().bundle(sourceFile)
      .then((value) => {
        npmLog('info', 'index.scss generated')

        writeFile(paths.dist, value.bundledContent)
        writeFile(paths.module, value.bundledContent)
        callback()
      })
      .catch((error) => {
        callback(error)
      })
  }
}

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
import path from 'path'
import chokidar from 'chokidar'
import microbundle from 'microbundle'
import { readJsonSync } from 'fs-extra'

import commands from './commands'
import showVersion from './showVersion'
import getOpts from './getOpts'
import getPaths from './getPaths'

import { checkPackages, getDeferred, npmLog } from './util'

export default (actionName, params, callback) => {
  const options = getOpts(params)
  const resolvePath = (...name) => path.join(options.cwd, ...name)
  const packageJson = readJsonSync(resolvePath('package.json'))
  const sourceDir = resolvePath('src')
  const config = {
    resolvePath,
    packageJson,
    options,
    paths: {
      dist: getPaths(options.cwd, packageJson.main),
      module: getPaths(options.cwd, packageJson.module),
      typings: getPaths(options.cwd, packageJson.typings || packageJson.types),
    },
  }

  const cmd = (type, throwError) => {
    const deferred = getDeferred()
    const handleErr = (error) => {
      npmLog('error', error)
      if (throwError) {
        throw error
      }
    }
    try {
      commands[type](config, (error, result) => {
        if (error) {
          deferred.reject(error)
          handleErr(error)
        } else {
          deferred.resolve(result)
        }
      })
    } catch (error) {
      handleErr(error)
    }
    return deferred
  }

  showVersion()
  if (commands[actionName]) {
    commands[actionName](config, callback)
  } else {
    cmd('clean').then(() => {
      npmLog('info', 'bundle...')

      checkPackages(packageJson)
      microbundle(options).then(() => {
        Promise.all([
          cmd('bundle-scss', true), // 打包SASS
          cmd('bundle-dts', true),
        ]).then(() => {
          cmd('prepare-pkg', true)
        })
      })
    })
    if (options.watch) {
      const watcher = chokidar.watch(sourceDir, {
        ignoreInitial: true,
        ignorePermissionErrors: true,
        awaitWriteFinish: {
          stabilityThreshold: 1000,
          pollInterval: 500,
        },
      })
      watcher.on('all', (event, paths) => {
        const basename = path.basename(paths)
        if (basename.endsWith('.scss')) {
          cmd('bundle-scss')
        } else if (basename.endsWith('.d.ts')) {
          cmd('bundle-dts')
        }
      })
    }
  }
}

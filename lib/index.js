/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const path = require('path')
const chokidar = require('chokidar')
const microbundle = require('microbundle')
const { readJsonSync } = require('fs-extra')
const commands = require('./commands')
const getOpts = require('./getOpts')
const getPaths = require('./getPaths')
const { checkPackages, getDeferred, waitAWhile, npmLog } = require('./util')

module.exports = (actionName, params, callback) => {
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

  const callCommand = (type, throwError) => {
    const deferred = getDeferred()
    try {
      commands[type](config, (error, result) => {
        if (error) {
          deferred.reject(error)
          npmLog('error', error)
          if (throwError) {
            throw error
          }
        } else {
          deferred.resolve(result)
        }
      })
    } catch (e) {
      npmLog('error', e)
      if (throwError) {
        throw e
      }
    }
    return deferred
  }
  if (commands[actionName]) {
    commands[actionName](config, callback)
  } else {
    options.onBuild = waitAWhile(600, () => {
      if (options.watch) {
        return
      }
      callCommand('bundle-scss', true)
      callCommand('bundle-dts', true)
    })
    callCommand('clean').then(() => {
      npmLog('info', 'call microbundle...')

      checkPackages(packageJson)
      microbundle(options).then(() => {
        options.onBuild()
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
        if (basename && typeof basename === 'string') {
          if (basename.endsWith('.scss')) {
            callCommand('bundle-scss')
          } else if (basename.endsWith('.d.ts')) {
            callCommand('bundle-dts')
          }
        }
      })
    }
  }
}

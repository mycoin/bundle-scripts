/* eslint-disable no-console */
const path = require('path')
const microbundle = require('microbundle')
const { readJsonSync, existsSync, emptyDirSync } = require('fs-extra')
const generateDts = require('./generateDts')
const bundleScss = require('./bundleScss')

const getOpts = require('./getOpts')
const { outputName, preCheckPkg, waitWhile } = require('./util')

module.exports = (params, callback) => {
  const opts = getOpts(params)
  const at = (name) => path.join(opts.cwd, name)

  const pkg = readJsonSync(at('package.json'))
  const indexDts = at('src/index.d.ts')
  const indexSass = at('src/index.scss')

  const otherTask = () => {
    if (!opts.generateTypes) {
      generateDts(pkg.typings, indexDts)
    }
    if (existsSync(indexSass)) {
      bundleScss(path.join(outputName, 'index.scss'), indexSass)
    }
  }

  // resolve watch devMode
  if (opts.watch) {
    opts.compress = false
  } else {
    opts.sourcemap = false
  }

  if (pkg.typings && !existsSync(indexDts)) {
    opts.generateTypes = true
  }

  // opts.onStart
  if (opts.watch) {
    opts.onBuild = waitWhile(500, otherTask)
  }

  // check dist name
  preCheckPkg(pkg)
  // remove dist
  emptyDirSync(path.join(opts.cwd, outputName))

  // start build....
  microbundle(opts).then((result) => {
    callback(null, result)
    if (!opts.watch) {
      otherTask()
    }
  }).catch((error) => {
    callback(error)
  })
}

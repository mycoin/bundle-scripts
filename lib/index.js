/* eslint-disable no-console */
const path = require('path')
const microbundle = require('microbundle')
const { readJsonSync, existsSync, emptyDirSync } = require('fs-extra')
const generateDts = require('./generateDts')
const getOpts = require('./getOpts')
const { outputName, preCheckPkg } = require('./util')

module.exports = (params, callback) => {
  const opts = getOpts(params)
  const at = (name) => path.join(opts.cwd, name)

  const pkg = readJsonSync(at('package.json'))
  const indexDts = at('src/index.d.ts')

  // resolve watch devMode
  if (opts.watch) {
    opts.compress = false
  } else {
    opts.sourcemap = false
  }

  if (pkg.typings && !existsSync(indexDts)) {
    opts.generateTypes = true
  }

  // check dist name
  preCheckPkg(pkg)
  // remove dist
  emptyDirSync(path.join(opts.cwd, outputName))

  // start build....
  microbundle(opts).then((result) => {
    if (!opts.generateTypes) {
      generateDts(pkg.typings, indexDts)
    }
    callback(null, result)
  }).catch((error) => {
    callback(error)
  })
}

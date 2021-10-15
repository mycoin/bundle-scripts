const clean = require('./clean')
const bundleDts = require('./bundleDts')
const bundleScss = require('./bundleScss')

module.exports = {
  clean,
  'bundle-dts': bundleDts,
  'bundle-scss': bundleScss,
}

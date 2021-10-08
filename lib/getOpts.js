const { cosmiconfigSync } = require('cosmiconfig')

const defaults = {
  'css-modules': null,
  'pkg-main': true,
  compress: true,
  css: 'external',
  entries: [],
  format: 'modern,esm,cjs,umd',
  generateTypes: false,
  jsx: 'React.createElement',
  target: 'web',
}

const convertMapping = (value) => {
  const returns = []
  if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      returns.push(key + '=' + value[key])
    })
  }
  return returns.join(',')
}

module.exports = (params) => {
  const explorerSync = cosmiconfigSync('bundle')
  const result = explorerSync.search(params.cwd) || {}
  const opt = result.config || {}

  opt.alias = convertMapping(opt.alias)
  opt.define = convertMapping(opt.define)
  opt.globals = convertMapping(opt.globals)

  if (Array.isArray(opt.external)) {
    opt.external = opt.external.join(',')
  }
  return {
    ...defaults,
    ...opt,
    ...params,
  }
}

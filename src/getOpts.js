import { cosmiconfigSync } from 'cosmiconfig'
import { readJsonSync } from 'fs-extra'
import path from 'path'
import { getGlobalEnvs } from './util'

const defaults = {
  'css-modules': null,
  'pkg-main': true,
  compress: false,
  css: 'external',
  entries: [],
  format: 'modern,esm,cjs,umd',
  generateTypes: false,
  jsx: 'React.createElement',
  target: 'web',
}

const convertMap = (value) => {
  const returns = []
  if (value && typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      returns.push(key + '=' + value[key])
    })
  }
  return returns.length ? returns.join(',') : null
}

const convertArray = (value) => {
  return Array.isArray(value) ? value.join(',') : null
}

const getPkg = (cwd) => {
  const file = path.join(cwd, 'package.json')
  const json = readJsonSync(file)
  return json
}

export default (params) => {
  const explorerSync = cosmiconfigSync('bundle')
  const result = explorerSync.search(params.cwd) || {}
  const opt = result.config || {}

  opt.generateTypes = true
  opt.pkg = getPkg(params.cwd)
  opt.alias = convertMap(opt.alias)
  opt.define = convertMap({
    ...getGlobalEnvs(opt.pkg),
    ...opt.define,
  })

  opt.globals = convertMap(opt.globals)
  opt.external = convertArray(opt.external)

  if (!params.watch) {
    opt.compress = {
      preset: [
        'default',
        {
          // 禁用链接优化插件
          normalizeUrl: false,
        },
      ],
    }
  }
  return {
    ...defaults,
    ...opt,
    ...params,
  }
}

const path = require('path')
const { spawn } = require('child_process')
const log = require('npmlog')

const getDirTopName = (field) => {
  if (field) {
    return field.replace('./', '').split('/')[0]
  }
  return null
}

const checkPaths = (pkg, field, chooseOne) => {
  if (!pkg[field]) {
    return
  }

  const name = getDirTopName(pkg[field])
  if (chooseOne.indexOf(name) === -1) {
    throw new Error("package's `" + field + '` must startsWith one of: ' + chooseOne)
  }
}

const checkPackages = (pkg) => {
  checkPaths(pkg, 'main', ['dist'])
  checkPaths(pkg, 'module', ['dist', 'es'])
  checkPaths(pkg, 'typings', ['types', 'typings'])
}
const waitAWhile = (wait, fn) => {
  let timeout = null
  return (...params) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...params)
    }, wait || 1000)
  }
}

exports.checkPackages = checkPackages
exports.waitAWhile = waitAWhile
exports.exec = (command, args, options) => {
  if (process.env.comspec) {
    return spawn(process.env.comspec, ['/c', command].concat(args), options)
  }
  return spawn(command, args, options)
}

exports.getNestPackage = (cwd, packageName) => {
  return require.resolve(packageName, {
    paths: [
      path.join(cwd, 'node_modules'),
    ],
  })
}

exports.getDeferred = () => {
  const extend = {}
  const promise = new Promise((resolve, reject) => {
    extend.resolve = resolve
    extend.reject = reject
  })
  promise.resolve = extend.resolve
  promise.reject = extend.reject

  return promise
}

exports.npmLog = (type, ...content) => {
  log[type]('bundle', ...content)
}

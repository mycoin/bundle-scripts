import path from 'path'
import { spawn } from 'child_process'
import log from 'npmlog'

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

const exec = (command, args, options) => {
  if (process.env.comspec) {
    return spawn(process.env.comspec, ['/c', command].concat(args), options)
  }
  return spawn(command, args, options)
}

const getNestPackage = (cwd, packageName) => {
  return require.resolve(packageName, {
    paths: [
      path.join(cwd, 'node_modules'),
    ],
  })
}

const getDeferred = () => {
  const extend = {}
  const promise = new Promise((resolve, reject) => {
    extend.resolve = resolve
    extend.reject = reject
  })
  promise.resolve = extend.resolve
  promise.reject = extend.reject

  return promise
}

const npmLog = (type, ...content) => {
  log[type]('bundle', ...content)
}

export {
  checkPackages,
  waitAWhile,
  exec,
  getNestPackage,
  getDeferred,
  npmLog,
}

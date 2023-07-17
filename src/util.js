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

const isCloudBuild = () => process.env.BUILD_ENV === 'cloud'
const checkBranchName = (pkg) => {
  if (!isCloudBuild()) {
    return
  }

  const buildGitBranch = process.env.BUILD_GIT_BRANCH
  const branchVersion = buildGitBranch.split('/')[1]

  if (branchVersion !== pkg.version) {
    throw new Error("package's `version` missmatch git branch " + branchVersion)
  }
}

const exec = (command, args, options) => {
  if (process.env.comspec) {
    return spawn(process.env.comspec, ['/c', command].concat(args), options)
  } else {
    return spawn(command, args, options)
  }
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

const getGlobalEnvs = (pkg) => ({
  // build timestamp
  'process.env.BTS': JSON.stringify(new Date()),
  'process.env.VERSION': JSON.stringify(pkg.version),
})

export {
  /**/
  isCloudBuild,
  checkBranchName,
  checkPackages,
  exec,
  getGlobalEnvs,
  getDeferred,
  npmLog,
}

const outputName = 'dist'
const checkPath = (content) => {
  if (content && !content.startsWith(outputName + '/')) {
    throw new Error("package's target must be  startsWith 'dist/'")
  }
}

const preCheckPkg = (pkg) => {
  checkPath(pkg.main)
  checkPath(pkg.module)
  checkPath(pkg.typings)
}

const waitWhile = (wait, fn) => {
  let timeout = null
  return (...params) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...params)
    }, wait || 1000)
  }
}

exports.waitWhile = waitWhile
exports.outputName = outputName
exports.preCheckPkg = preCheckPkg

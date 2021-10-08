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

exports.outputName = outputName
exports.preCheckPkg = preCheckPkg

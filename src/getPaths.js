import path from 'path'

export default (cwd, name) => {
  if (name && typeof name === 'string') {
    const result = path.join(cwd, name)
    const relatived = path.relative(cwd, path.dirname(result))
    if (!relatived) {
      throw new Error('dist/module file must be under a dir')
    }
    return result
  }
  return null
}

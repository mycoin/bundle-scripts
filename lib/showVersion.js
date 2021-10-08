const printMessage = require('print-message')
const { version } = require('../package.json')

const text = `
  _                     _ _
  | |__  _   _ _ __   __| | | ___
  | '_ \\| | | | '_ \\ / _\` | |/ _ \\
  | |_) | |_| | | | | (_| | |  __/
  |_.__/ \\__,_|_| |_|\\__,_|_|\\___|  v${version}
`

module.exports = () => {
  printMessage(text.split('\n'), {
    border: false,
    color: 'gray',
  })
}

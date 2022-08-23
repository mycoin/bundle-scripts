import printMessage from 'print-message'
import { version } from '../package.json'

const text = `
  _                     _ _
  | |__  _   _ _ __   __| | | ___
  | '_ \\| | | | '_ \\ / _\` | |/ _ \\
  | |_) | |_| | | | | (_| | |  __/
  |_.__/ \\__,_|_| |_|\\__,_|_|\\___|  v${version}
`

export default () => {
  printMessage(text.split('\n'), {
    border: false,
    color: 'gray',
  })
}

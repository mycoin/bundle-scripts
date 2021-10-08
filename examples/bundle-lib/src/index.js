import isNumber from 'is-number-fake'
import isObject from 'is-object'

console.error(isObject, isNumber)
console.error(process.env.VERSION)

export default {
  isNumber,
  isObject,
}

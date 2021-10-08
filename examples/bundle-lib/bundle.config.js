module.exports = {
  define: {
    'process.env.VERSION': 2,
  },
  alias: {
    'is-number-fake': 'is-number',
  },

  external: ['is-number', 'is-object'],
  globals: {
    'is-number': 'isNumber',
    'is-object': 'isObject',
  },
}

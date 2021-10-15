#!/usr/bin/env node
/* eslint-disable no-console */

const bundle = require('../lib')
const showVersion = require('../lib/showVersion')

const actionName = process.argv[2]
const params = {
  cwd: process.cwd(),
  watch: /watch|dev/i.test(actionName),
}

process.on('SIGINT', process.exit)
process.on('unhandledRejection', (error) => {
  console.error(error)
  process.exit(1)
})

showVersion()
bundle(actionName, params, (error, result) => {
  if (error) {
    throw error
  } else if (result && result.output) {
    console.log(result.output)
  }
})

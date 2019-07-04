#!/usr/bin/env node

const { isJSFile, listFiles, listExecutedTests, runMocha } = require('./lib')

const getArgs = () => {
  if ((process.argv.length <= 2) || ((process.argv[2] === '-h') || (process.argv[2] === '--help'))) {
    console.log('Use: mocha-list <test-dir>\n')
    console.log('Copyright(c) 2019 Mostafa Yassin <mostafa_mahmoud@protonmail.com> - MIT Licensed')
    process.exit(0)
  }
  const testDir = process.argv[2] || 'test'
  return { testDir }
}

/**
 * This is a basic implementation that
 * Searches for all JS files under the specified test dir
 * Patch Mocha's test runner
 * Run Mocha programmatically
 * List the full title of all executed tests
 */
const main = async () => {
  const args = getArgs()
  const files = listFiles(args.testDir).filter(isJSFile)
  const runner = await runMocha(files, { reporter: 'min' })
  const tests = listExecutedTests(runner)
  console.log(tests.join('\n'))
  return tests
}

main().catch((error) => {
  console.error(error)
  process.exit(-1)
})

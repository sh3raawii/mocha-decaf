#!/usr/bin/env node

const Mocha = require('mocha')
const { listAllFiles, isJSFile, patchTestRunner } = require('./lib')

const getArgs = () => {
  if ((process.argv.length <= 2) || ((process.argv[2] === '-h') || (process.argv[2] === '--help'))) {
    console.log('Use: mocha-dry-basic <test-dir>\n')
    console.log('Copyright(c) 2019 Mostafa Yassin - MIT Licensed')
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
 */
const main = async () => {
  const args = getArgs()
  // Instantiate a Mocha instance
  const mocha = new Mocha()
  // List all JS files and add them to mocha
  const files = listAllFiles(args.testDir)
  files.filter(isJSFile).forEach((testFile) => {
    mocha.addFile(testFile)
  })
  // Patch Mocha's test runner
  patchTestRunner()
  // Run the tests
  mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0
    process.exit()
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(-1)
})

const Mocha = require('mocha')
const path = require('path')
const fs = require('fs')

/**
 * Check whether the file has the extension of JS files (*.js)
 * @param {String} filePath Path to a file holding filename and file extension
 */
const isJSFile = (filePath) => filePath.substr(-3) === '.js'

/**
 * List all the files in a given directory, by default in recursive fashion
 * @param {String} dir Path to a dir
 */
const listFiles = (dir, recursive = true) => {
  let JSFiles = []
  const dirContents = fs.readdirSync(dir)
  for (const item of dirContents) {
    const itemPath = path.join(dir, item)
    const itemStat = fs.statSync(itemPath)
    if (itemStat.isFile()) JSFiles.push(itemPath)
    else if (itemStat.isDirectory() && recursive) JSFiles = JSFiles.concat(listFiles(itemPath))
  }
  return JSFiles
}

/**
 * Patch the runTest method of the Mocha Test Runner to pass all tests
 */
const patchTestRunner = () => {
  Mocha.Runner.prototype.runTest = (callback) => {
    callback()
  }
}

/**
 * Patch BeforeEach of the Mocha Suite to do nothing
 */
const patchBeforeEach = () => {
  Mocha.Suite.prototype.beforeEach = () => {
    return this
  }
}

/**
 * Patch AfterEach of the Mocha Suite to do nothing
 */
const patchAfterEach = () => {
  Mocha.Suite.prototype.afterEach = () => {
    return this
  }
}

/**
 * Patch BeforeAll of the Mocha Suite to do nothing
 */
const patchBeforeAll = () => {
  Mocha.Suite.prototype.beforeAll = () => {
    return this
  }
}

/**
 * Patch AfterAll of the Mocha Suite to do nothing
 */
const patchAfterAll = () => {
  Mocha.Suite.prototype.afterAll = () => {
    return this
  }
}

/**
 * Exits Mocha when Mocha itself has finished execution, regardless of
 * what the tests or code under test is doing.
 * @param {number} code - Exit code; typically # of failures
 */
const exitMocha = code => {
  const clampedCode = Math.min(code, 255)
  let draining = 0

  // Eagerly set the process's exit code in case stream.write doesn't
  // execute its callback before the process terminates.
  process.exitCode = clampedCode

  // flush output for Node.js Windows pipe bug
  const done = () => {
    if (!draining--) {
      process.exit(clampedCode)
    }
  }

  const streams = [process.stdout, process.stderr]
  streams.forEach(stream => {
    // submit empty write request and wait for completion
    draining += 1
    stream.write('', done)
  })

  done()
}

/**
 * Run mocha programatically on the given test files
 * @param {Array} files list of the test files
 * @param {Object} mochaArgs Object holding mocha arguments, Refer to mocha's documentation
 */
const runMocha = async (files = [], mochaArgs = {}) => {
  const mocha = new Mocha(mochaArgs)
  files.forEach((testFile) => {
    mocha.addFile(testFile)
  })
  patchBeforeEach()
  patchAfterEach()
  patchBeforeAll()
  patchAfterAll()
  patchTestRunner()
  return mocha.run(exitMocha)
}

/**
 * List all tests that were executed by the test runner
 * @param {Mocha.Runner} runner Mocha's test runner after calling .run()
 */
const listExecutedTests = (runner) => {
  const listTests = (suite) => {
    let tests = []
    for (const test of suite.tests) {
      tests.push(suite.fullTitle() + ' ' + test.title)
    }
    for (const s of suite.suites) {
      tests = tests.concat(listTests(s))
    }
    return tests
  }
  return listTests(runner.suite)
}

/**
 * Start Mocha
 */
const startMocha = () => {
  require('mocha/bin/_mocha')
}

module.exports = {
  isJSFile,
  listFiles,
  listExecutedTests,
  patchTestRunner,
  patchBeforeEach,
  patchBeforeAll,
  patchAfterEach,
  patchAfterAll,
  runMocha,
  startMocha
}

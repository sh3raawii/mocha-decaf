const Mocha = require('mocha')
const path = require('path')
const fs = require('fs')

/**
 * does the file has the extension of JS files (*.js)
 * @param {String} filePath path to a file
 * @returns {Boolean} true if the file has .js extension, false otherwise
 * @example
 * > isJSFile('./index.js')
 * true
 */
const isJSFile = (filePath) => filePath.substr(-3) === '.js'

/**
 * List all the files in a given directory, by default in recursive mode
 * @param {String} dir Path to a dir
 * @param {Boolean} [recursive=true] Search in nested directories
 * @returns {String[]} Array of files found in the given directory
 * @example
 * > listFiles('./')
 * ['main.js', 'package.json', 'README.md', 'test/main.test.js']
 * > listFiles('./', false)
 * ['main.js', 'package.json', 'README.md']
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
 * @example
 * patchTestRunner()
 */
const patchTestRunner = () => {
  Mocha.Runner.prototype.runTest = (callback) => {
    callback()
  }
}

/**
 * Patch beforeEach() to do nothing
 * @example
 * patchBeforeEach()
 */
const patchBeforeEach = () => {
  Mocha.Suite.prototype.beforeEach = () => {
    return this
  }
}

/**
 * Patch afterEach() to do nothing
 * @example
 * patchAfterEach()
 */
const patchAfterEach = () => {
  Mocha.Suite.prototype.afterEach = () => {
    return this
  }
}

/**
 * Patch before() to do nothing
 * @example
 * patchBeforeAll()
 */
const patchBeforeAll = () => {
  Mocha.Suite.prototype.beforeAll = () => {
    return this
  }
}

/**
 * Patch after() to do nothing
 * @example
 * patchAfterAll()
 */
const patchAfterAll = () => {
  Mocha.Suite.prototype.afterAll = () => {
    return this
  }
}

/**
 * This function is ported from Mocha run helpers
 *
 * Exits Mocha when Mocha itself has finished execution, regardless of
 * what the tests or code under test is doing.
 * @param {number} code - Exit code; typically # of failures
 * @private
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
 * Run mocha programatically on given test files
 * @async
 * @param {Array} [files=[]] Array of test files
 * @param {Object} [mochaOptions={}] Mocha options, refer to {@link https://mochajs.org/api/mocha|mocha's api documentation}
 * @returns {Promise<Mocha.Runner>} Promise with the {@link https://mochajs.org/api/runner|mocha runner instance} that ran all the tests
 * @see {@link https://mochajs.org/api/|Mocha API documentation}
 *
 * @example <caption>To run the tests in ./test/main.test.js with default mocha options</caption>
 * > runMocha(['./test/main.test.js'])
 * ```
 *    test suite
 *    ✓ test case
 *
 *  1 passing (7ms)
 * ```
 *
 * @example <caption>To run the tests in ./test/main.test.js with the nyan mocha reporter</caption>
 * > runMocha(['./test/main.test.js'], { reporter: 'nyan' })
 * ```
 *  1 -__,------,
 *  0 -__|  /\_/\
 *  0 -_~|_( ^ .^)
 *    -_ ""  ""
 *
 * 1 passing (11ms)
 * ```
 */
const runMocha = async (files = [], mochaOptions = {}) => {
  const mocha = new Mocha(mochaOptions)
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
 * List all tests that were executed by a mocha test runner
 * @see {@link https://mochajs.org/api/runner|Mocha Runner}
 * @param {Mocha.Runner} runner {@link https://mochajs.org/api/runner|Mocha Runner instance}
 * @returns {String[]} Array of the full test names that were executed (Root suite name + child suite names + test name)
 * @example
 * > listExecutedTests(runMocha(['./test/main.test.js'], { reporter: 'base' }))
 * [ 'test suite test case' ]
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
 * Start mocha by requiring the _mocha script
 * @example
 * startMocha()
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

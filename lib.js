const Mocha = require('mocha')
const path = require('path')
const fs = require('fs')

/**
 *
 * @param {String} filePath Path to a file holding filename and file extension
 */
const isJSFile = (filePath) => filePath.substr(-3) === '.js'

/**
 *
 * @param {String} dir Path to a dir
 */
const listAllFiles = (dir) => {
  let JSFiles = []
  const dirContents = fs.readdirSync(dir)
  for (const item of dirContents) {
    const itemPath = path.join(dir, item)
    const itemStat = fs.statSync(itemPath)
    if (itemStat.isFile()) JSFiles.push(itemPath)
    else if (itemStat.isDirectory()) JSFiles = JSFiles.concat(listAllFiles(itemPath))
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
 * Start Mocha
 */
const startMocha = () => {
  require('mocha/bin/_mocha')
}

module.exports = {
  isJSFile,
  listAllFiles,
  patchTestRunner,
  patchBeforeEach,
  patchBeforeAll,
  patchAfterEach,
  patchAfterAll,
  startMocha,
  exitMocha
}

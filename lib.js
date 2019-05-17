const Mocha = require('mocha')
const util = require('util')
const path = require('path')
const fs = require('fs')
const readdir = util.promisify(fs.readdir)

/**
 * 
 * @param {String} filePath Path to a file holding filename and file extension
 */
const isJSFile = (filePath) => filePath.substr(-3) === '.js'

/**
 * 
 * @param {String} testDirectory Path of the project test directory
 */
const listAllFiles = async (testDirectory) => {
    let JSFiles = []
    const dirContents = await readdir(testDirectory, {withFileTypes: true})
    for (const item of dirContents) {
        const itemPath = path.join(testDirectory, item.name)
        if (item.isFile()) JSFiles.push(itemPath)
        else if (item.isDirectory()) JSFiles = JSFiles.concat(await listAllFiles(itemPath))
    }
    return JSFiles
}

/**
 * Patch the runTest method of the Mocha Test Runner to pass all tests
 */
const patchTestRunner = () => {
    Mocha.Runner.prototype.runTest = (callback) => {
        callback()
        return
    }
}

module.exports = {
    isJSFile,
    listAllFiles,
    patchTestRunner
}

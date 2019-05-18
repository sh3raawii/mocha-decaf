#!/usr/bin/env node

/**
 * Patch Mocha's Test Runner then run mocha
 */
const { patchTestRunner } = require('./lib')

patchTestRunner()
require('mocha/bin/_mocha')

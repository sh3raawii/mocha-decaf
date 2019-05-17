#!/usr/bin/env node

/**
 * Patch Mocha's Test Runner then run mocha
 */

const { patchTestRunner } = require('./lib')
const mocha = require('mocha/lib/cli').main

patchTestRunner()
mocha()
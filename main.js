#!/usr/bin/env node

/**
 * Patch Mocha's hooks and test runner then run mocha
 */

const {
  startMocha,
  patchTestRunner,
  patchBeforeEach,
  patchAfterEach,
  patchBeforeAll,
  patchAfterAll
} = require('./lib')

// Patch Mocha's Hooks
patchBeforeEach()
patchAfterEach()
patchBeforeAll()
patchAfterAll()

// Patch Mocha's Test Runner
patchTestRunner()

// Start Mocha
startMocha()

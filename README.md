# mocha-decaf

Run mocha tests in dry-run mode, it's like [mocha](https://mochajs.org/) but without caffeine

[![Build Status](https://travis-ci.org/sh3raawii/mocha-decaf.svg?branch=master)](https://travis-ci.org/sh3raawii/mocha-decaf)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Install

Using [npm](https://www.npmjs.com/)
```Shell
$ npm i mocha-decaf
```

Alternatively using [yarn](https://yarnpkg.com/en/)
```Shell
$ yarn add mocha-decaf
```

## Usage
- You can use `mocha-decaf` to run your tests the same way you use `mocha`
```Shell
$ mocha-decaf --recursive
```
For a complete list of command line arguments and options check [Mocha's Documentation](https://mochajs.org/#command-line-usage)

- You can also run and list the tests programmatically
```javascript
const { isJSFile, listFiles, listExecutedTests, runMocha } = require('mocha-decaf')
// list the js files under the test directory
const testFiles = listFiles('./test').filter(isJSFile)
// run the tests with the base mocha reporter
const runner = runMocha(testFiles, { reporter: 'base' })
// list the tests executed
const tests = listExecutedTests(runner)
console.log(tests.join('\n'))
```
For a complete list of the available functions check the API documentation

- The above code is exported with the following command
```Shell
$ mocha-list ./test
```

## How is this package useful ?

- You can use this package to list all the tests that should be run without actually running them to show what your tests are covering to stakeholders

- You can also do all sorts of stuff before you actually run your tests using `mocha` like partitioning the tests to run them in batches on different machines in parallel, checkout [Mocha's test filters](https://mochajs.org/#command-line-usage)

## Notes

- This package is only useful till `mocha` implements this functionality, however it doesn't seem this is going to happen in the near future since a [PR](https://github.com/mochajs/mocha/pull/1070) was submitted 6 years ago and rejected.

## How it works

The command simply patches Mocha's test runner to pass any test then calls `mocha` to run all tests.

Starting from `v0.2.0` it also patches `before`, `beforeEach`, `after` and `afterEach`

## Caveats

- Some `mocha` arguments won't behave identically when used with `mocha-decaf` most notably `--forbid-only` because it should make the tests marked as `.only` fail however all tests will pass.

## License

[MIT](LICENSE)

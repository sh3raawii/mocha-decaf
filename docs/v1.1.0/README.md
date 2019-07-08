# mocha-decaf

[Mocha](https://mochajs.org/) with zero caffeine

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

## Notes

- This package is only useful till `mocha` implements this functionality, however it doesn't seem this is going to happen in the near future since a [PR](https://github.com/mochajs/mocha/pull/1070) was submitted 6 years ago and rejected.
- The dry run mode is not implemented in `mocha` till this date *05/2019* 

## How it works

The command simply patches Mocha's test runner to pass any test then calls `mocha` to run all tests.

Starting from `v0.2.0` it also patches `before`, `beforeEach`, `after` and `afterEach`

## Caveats

- Some `mocha` arguments won't behave identically when used with `mocha-decaf` most notably `--forbid-only` because it should make the tests marked as `.only` fail however all tests will pass.
- All tests pass no matter what options you pass to `mocha-decaf`.
- There is another command provided by the package named `mocha-list` that will run all tests in the specified test directory in dry-run mode as well however it's not as flexible as `mocha-decaf`

## License

[MIT](LICENSE)
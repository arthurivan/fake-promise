/*
 * Test runner
 *
 */

// Dependencies
const FakePromise = require('./../lib/fakePromise.js')
const assert = require('assert')

// Application logic for the test runner
const _app = {}

// Holder of all tests
_app.tests = {
  unit: {}
}

_app.tests.unit['FakePromise calls executor immediately'] = (done) => {
  let string
  new FakePromise(() => {
    string = 'Hello World!'
  })
  assert.strictEqual(string, 'Hello World!')
  done()
}

_app.tests.unit['FakePromise calls resolution handler when promise is resolved'] = (done) => {
  const string = 'Hello World!'

  const promise = new FakePromise((resolve) => {
    setTimeout(() => {
      resolve(string)
    }, 0)
  })

  promise.then((resolvedVal) => {
    assert.strictEqual(resolvedVal, string)
    done()
  })
}

_app.tests.unit['FakePromise supports many resolution handlers'] = (done) => {
  const string = 'Hello World!'

  const promise = new FakePromise((resolve) => {
    setTimeout(() => {
      resolve(string)
    }, 0)
  })

  promise.then((resolvedVal) => {
    assert.strictEqual(resolvedVal, string)
  })

  promise.then((resolvedVal) => {
    assert.strictEqual(resolvedVal, string)
    done()
  })
}

_app.tests.unit['FakePromise can chain resolution handlers of promises'] = (done) => {
  const string = 'Hello World!'

  const promise = new FakePromise((resolve) => {
    setTimeout(() => {
      resolve(string)
    }, 0)
  })

  promise.then((resolvedVal) => {
    return new FakePromise((resolve) => {
      setTimeout(() => {
        resolve(resolvedVal)
      }, 0)
    })
  }).then((resolvedVal) => {
    assert.strictEqual(resolvedVal, string)
    done()
  })
}

_app.tests.unit['FakePromise can chain with non-promise return values'] = (done) => {
  const string = 'Hello World!'

  const promise = new FakePromise((resolve) => {
    setTimeout(() => {
      resolve(string)
    }, 0)
  })

  promise.then((resolvedVal) => {
    return resolvedVal
  }).then((resolvedVal2) => {
    assert.strictEqual(resolvedVal2, string)
    done()
  })
}

_app.countTests = () => {
  let counter = 0
  for (const key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key]
      for (const testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          counter++
        }
      }
    }
  }
  return counter
}

_app.runTests = () => {
  const errors = []
  let successes = 0
  const limit = _app.countTests()
  let counter = 0
  for (const key in _app.tests) {
    if (_app.tests.hasOwnProperty(key)) {
      const subTests = _app.tests[key]
      for (const testName in subTests) {
        if (subTests.hasOwnProperty(testName)) {
          (() => {
            const tmpTestName = testName
            const testValue = subTests[testName]
            // Call the test
            try {
              testValue(() => {
                // If it calls done() then it succeeded, so log it in green
                console.log('\x1b[32m%s\x1b[0m', tmpTestName)
                counter++
                successes++
                if (counter === limit) {
                  _app.produceTestReport(limit, successes, errors)
                }
              })
            } catch (e) {
              // If it throws, then it failed, so catch error and log it in red
              errors.push({
                name: testName,
                error: e
              })
              console.log('\x1b[31m%s\x1b[0m', tmpTestName)
              counter++
              if (counter === limit) {
                _app.produceTestReport(limit, successes, errors)
              }
            }
          })()
        }
      }
    }
  }
}

_app.produceTestReport = (limit, successes, errors) => {
  console.log('')
  console.log('--------BEGIN TEST REPORT--------')
  console.log('')
  console.log('Total Tests: ', limit)
  console.log('\x1b[32m%s\x1b[0m','Pass: ', successes)
  console.log('\x1b[31m%s\x1b[0m','Fail: ', errors.length)
  console.log('')

  if (errors.length > 0) {
    console.log('--------BEGIN ERROR DETAILS--------')
    console.log('')
    errors.forEach((testError) => {
      console.log('\x1b[31m%s\x1b[0m', testError.name)
      console.log(testError.error)
      console.log('')
    })
    console.log('')
    console.log('--------END ERROR DETAILS--------')
  }

  console.log('')
  console.log('--------END TEST REPORT--------')
  console.log('')
}

_app.runTests()

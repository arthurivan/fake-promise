# Project Title

An implementation of promise called FakePromise that I made using test driven development.

## Running the tests

In terminal

```
node test
```

### Test Runner

My test runner is just a simple native implementation (without using jest or mocha and the like).
You can add more tests to the index.js file in the test folder using the following pattern:

```
_app.tests.unit['Name of Test'] = (done) => {
  //add your test logic here using nodes native assert libary
  
  // use node's native assert lib
  assert.strictEqual(string, 'Hello World!')
  
  // call done() to end the test and collect the success or errors
  // but make sure done() is put within your block of testing logic
  done()
}
```

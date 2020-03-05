function FakePromise(executor = () => {}) {
  executor(this.resolve.bind(this))
  this.resolutions = []
}
FakePromise.prototype.then = function (resolutionHandler) {
  let newPromise = new FakePromise()
  this.resolutions.push({
    handler: resolutionHandler,
    promise: newPromise
  })
  return newPromise
}
FakePromise.prototype.resolve = function (val) {
  while (this.resolutions.length > 0) {
    const resolution = this.resolutions.shift()
    const returnVal = resolution.handler(val)

    if (returnVal instanceof FakePromise) {
      returnVal.then((v) => {
        resolution.promise.resolve(v)
      })
    } else {
      resolution.promise.resolve(returnVal)
    }
  }
}

module.exports = FakePromise

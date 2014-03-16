(function(host) {

  var TIMEOUT = 100;

  function Promise(body) {
    this.body = body;

    this.resolveCallbackWasCalledByBody = false;
    this.resolveCallbackArgs = null;
    this.rejectCallbackWasCalledByBody = false;
    this.rejectCallbackArgs = null;
  }

  Promise.all = function(promises) {
    return new Promise(function(resolve, reject) {
      var computed = 0;
      var values = {};
      var isRejected = false;

      promises = promises || [];
      if (!(promises instanceof Array)) {
        reject(new Error("Promise.all: invalid arguments"));
        return;
      }
      if (promises.length == 0) {
        resolve();
        return;
      }
      promises = promises.map(function(promise) {
        return (promise.constructor == Promise) ? promise
          : Promise.resolve(promise);
      });

      values.length = promises.length;
      promises.forEach(function(promise, idx) {
        promise.then(function(value) {
          if (isRejected) {
            return;
          }
          computed++;
          values[idx] = value;
          if (computed == promises.length) {
            resolve([].slice.call(values, 0));
          }
        }, function(value) {
          if (isRejected) {
            return;
          }
          isRejected = true;
          reject(value);
        });
      });
    });
  };

  Promise.resolve = function(value) {
    return new Promise(function(resolve, reject) {
      if (value.then && (typeof(value.then) == "function")) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  };

  Promise.reject = function(value) {
    return new Promise(function(resolve, reject) {
        reject(value);
      }
    );
  };

  Promise.cast = function(value) {
    return (value.constructor == Promise)
      ? value
      : new Promise(function(resolve, reject) {
        resolve(value);
      });
  };

  Promise.prototype.catch = function(catchCallback) {
    return this.then(function(){}, catchCallback);
  };

  Promise.prototype.then = function(resolveCallback, rejectCallback) {
    var self = this;
    var wasResolved = false;
    var computedValue = undefined;
    var exceptionCaught = undefined;

    /*
     * Body can call resolveCallback and rejectCallback asynchronously
     * we instrument instrumentedResolveCallback to track when it has been called
     */
    var instrumentedResolveCallback = function() {
      var args = [].slice.call(arguments, 0);

      self.resolveCallbackWasCalledByBody = true;
      self.resolveCallbackArgs = args;
      try {
        computedValue = resolveCallback.apply(self, args);
      } catch (e) {
        exceptionCaught = e;
      }
      wasResolved = true;
    };

    var instrumentedRejectCallback = function() {
      var args = [].slice.call(arguments, 0);

      self.rejectCallbackWasCalledByBody = true;
      self.rejectCallbackArgs = args;
      try {
        computedValue = rejectCallback.apply(self, args);
      } catch (e) {
        exceptionCaught = e;
      }
      wasResolved = true;
    };

    /*
     * If the resolveCallback and rejectCallback were called by the body already
     * avoid executing the body multiple times
     */
    if (self.resolveCallbackWasCalledByBody) {
       instrumentedResolveCallback.apply(null, self.resolveCallbackArgs);
    } else if (self.rejectCallbackWasCalledByBody) {
       instrumentedRejectCallback.apply(null, self.rejectCallbackArgs);
    } else {
      try {
        this.body(instrumentedResolveCallback, instrumentedRejectCallback);
      } catch (e) {
        instrumentedRejectCallback(e);
      }
    }

    return new Promise(function(resolve, reject) {
      setTimeout(function waitingForSelf() {
        if (exceptionCaught) {
          reject(exceptionCaught);
          return;
        }
        if (wasResolved) {
          resolve(computedValue);
          return;
        }
        setTimeout(waitingForSelf, TIMEOUT);
      }, TIMEOUT);
    });
  };

  host.Promise = Promise;
})(this);
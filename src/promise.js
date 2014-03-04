(function(host) {

  var TIMEOUT = 100;

  function Promise(body) {
    this.body = body;
  }

  Promise.cast = function(value) {
    return new Promise(function(resolve, reject) {
      if (value.then && (typeof(value.then) == "function")) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
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

    var instrumentedResolveCallback = function() {
      var args = [].slice.call(arguments, 0);

      try {
        computedValue = resolveCallback.apply(self, args);
      } catch (e) {
        exceptionCaught = e;
      }
      wasResolved = true;
    };

    var instrumentedRejectCallback = function() {
      var args = [].slice.call(arguments, 0);

      try {
        computedValue = rejectCallback.apply(self, args);
      } catch (e) {
        exceptionCaught = e;
      }
      wasResolved = true;
    };

    /*
     * Body can call resolveCallback and rejectCallback asynchronously
     * we instrument instrumentedResolveCallback to track when it has been called
     */
    try {
      this.body(instrumentedResolveCallback, instrumentedRejectCallback);
    } catch (e) {
      instrumentedRejectCallback(e);
    }

    return new Promise(function(resolve, reject) {
      //TODO: Handle other cases, rejection, exceptions
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
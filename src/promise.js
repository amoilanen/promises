(function(host) {

  var TIMEOUT = 100;

  function Promise(body) {
    this.body = body;
  }

  Promise.prototype.then = function(resolveCallback, rejectCallback) {
    var self = this;
    var finishedSelf = false;
    var resolvedValue = undefined;
    var exceptionCaught = undefined;

    var instrumentedResolveCallback = function() {
      var args = [].slice.call(arguments, 0);

      try {
        resolvedValue = resolveCallback.apply(self, args);
      } catch (e) {
        exceptionCaught = e;
      }
      finishedSelf = true;
    };

    var instrumentedRejectCallback = function() {
      var args = [].slice.call(arguments, 0);

      try {
        resolvedValue = rejectCallback.apply(self, args);
      } catch (e) {
        exceptionCaught = e;
      }
      finishedSelf = true;
    };

    /*
     * Body can call resolveCallback and rejectCallback asynchronously
     * we instrument instrumentedResolveCallback to track when it has been called
     */
    this.body(instrumentedResolveCallback, instrumentedRejectCallback);

    return new Promise(function(resolve, reject) {
      //TODO: Handle other cases, rejection, exceptions
      setTimeout(function waitingForSelf() {
        if (finishedSelf) {
          if (exceptionCaught) {
            reject(exceptionCaught);
          } else {
            resolve(resolvedValue);
          }
        } else {
          setTimeout(waitingForSelf, TIMEOUT);
        }
      }, TIMEOUT);
    });
  };

  host.Promise = Promise;
})(this);
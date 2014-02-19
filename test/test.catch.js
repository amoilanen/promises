module("jsPromise.catch");

(function() {

  var errorMessage = "Error message value";

  asyncTest("Promise.catch is called in case a promise earlier in the chain throws an exception", function() {
    new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve();
      }, 500);
    }).then(function() {
      throw new Error(errorMessage);
    }).catch(function(error) {
      equal(errorMessage, error.message, "'catch' callback is called in case error is thrown");
      return error;
    }).then(function(value) {
      equal(errorMessage, value.message, "promise resolves to the value returned from 'catch' callback");
      start();
    });
  });

  asyncTest("Promise.catch is called in case a promise earlier in the chain is rejected", function() {
    var initialValue = 0;

    var promise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(errorMessage);
      }, 500);
    }).catch(function(value) {
      equal(errorMessage, value, "'catch' callback is called with the corresponding value");
      return value;
    }).then(function(value) {
      equal(errorMessage, value, "promise resolves to the value returned from 'catch' callback");
      start();
    });
  });

  //TODO: What if exception does not happen, do we continue execution after the 'catch' that was not called?
})();
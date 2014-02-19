module("jsPromise.then");

(function() {

  test("Promise.then synchronous scenario", function() {
    var resolvedValue = "Promise resolved value";
    var rejectedErrorMessage = "Promise rejected";
    var messages = [];

    var resolvingPromise = new Promise(function(resolve, reject) {
      resolve(resolvedValue);
    });
    var rejectingPromise = new Promise(function(resolve, reject) {
      reject(new Error(rejectedErrorMessage));
    });

    resolvingPromise.then(function(result) {
      messages.push(result);
    }, function(err) {
      ok(false, "Not an expected error from resolvingPromise", err);
    });

    deepEqual(messages, [resolvedValue], "resolvedValue promise");

    rejectingPromise.then(function(result) {
      ok(false, "The promise rejectingPromise should not have resolved to ", result);
    }, function(err) {
      messages.push(err.message);
    });

    deepEqual(messages, [resolvedValue, rejectedErrorMessage], "resolvedValue, rejectedErrorMessage promise");
  });

  asyncTest("Promise.then asynchronous scenario", function() {
    var promisedValue = 53804;

    var promise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(promisedValue);
      }, 500);
    });

    promise.then(function(value) {
      equal(promisedValue, value, "Asynchronous promise works");
      start();
    });
  });

  asyncTest("Promise.then chaining thens synchronous", function() {
    var initialValue = 0;
    var result = [];

    var promise = new Promise(function(resolve, reject) {
      resolve(initialValue);
    });

    for (var i = 0; i < 5; i++) {
      promise = promise.then(function(value) {
        result.push(value);
        return value + 1;
      });
    }
    promise.then(function(value) {
      deepEqual([0, 1, 2, 3, 4], result, "Chaining promise works");
      start();
    });
  });

  asyncTest("Promise.then chaining thens asynchronous", function() {
    var initialValue = 0;
    var result = [];

    var promise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(initialValue);
      }, 500);
    });

    for (var i = 0; i < 5; i++) {
      promise = promise.then(function(value) {
        result.push(value);
        return value + 1;
      });
    }
    promise.then(function(value) {
      deepEqual([0, 1, 2, 3, 4], result, "Asynchronous chained promise works");
      start();
    });
  });

  asyncTest("Promise.then if an error is thrown in the resolve callback, the returned promise rejects with that error", function() {
    var initialValue = 4241;
    var errorMessage = "Error occurred";

    new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(initialValue);
      }, 500);
    }).then(function() {
      throw new Error(errorMessage);
    }).then(function(value) {}, function(error) {
      equal(errorMessage, error.message, "onRejected callback is called in case error is thrown");
      return error;
    }).then(function(value) {
      equal(errorMessage, value.message, "Value passed to onRejected callback becomes the value the promise created by 'then' resolves to");
      start();
    });
  });

  asyncTest("Promise.then if an error is thrown in the original promise body, the returned promise rejects with that error", function() {
    var errorMessage = "Error occurred";

    new Promise(function(resolve, reject) {
      throw new Error(errorMessage);
    }).then(function() {}, function(value) {
      equal(errorMessage, value.message, "'then' returns a promise which is rejected with the value of error in the original promise body");
      start();
    });
  });

  asyncTest("Promise.then the case when errors happen both in body and callback is handled", function() {
    var errorMessage = "Error occurred";

    new Promise(function(resolve, reject) {
      throw new Error(errorMessage);
    }).then(function() {}, function(value) {
      equal(errorMessage, value.message, "'then' returns a promise which is rejected with the value of error in the original promise body");
      throw value;
    }).then(function(value) {}, function(error) {
      equal(errorMessage, error.message, "onRejected callback is called in case error is thrown");
      return error;
    }).then(function(value) {
      equal(errorMessage, value.message, "Value passed to onRejected callback becomes the value the promise created by 'then' resolves to");
      start();
    });
  });

  asyncTest("Promise.then if exception is thrown in the reject callback then the returned promise rejects with that error", function() {
    var initialValue = 4241;
    var errorMessage = "Error occurred";

    new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(initialValue);
      }, 500);
    }).then(function() {}, function(value) {
      throw new Error(errorMessage);
    }).then(function(value) {}, function(error) {
      equal(errorMessage, error.message, "onRejected callback is called in case error is thrown");
      return error;
    }).then(function(value) {
      equal(errorMessage, value.message, "Value passed to onRejected callback becomes the value the promise created by 'then' resolves to");
      start();
    });
  });

  asyncTest("Promise.then promises in the chain can be rejected", function() {
    var initialValue = 0;

    var promise = new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(initialValue);
      }, 500);
    }).then(function() {}, function(value) {
      equal(initialValue, value, "'reject' callback is called with the corresponding value");
      return value;
    }).then(function(value) {
      equal(initialValue, value, "promise resolves to the value returned from 'reject' callback");
      start();
    });
  });

  //TODO: Promise can be resolved with 'undefined', 'null'
  //TODO: Promise can be rejected with 'undefined', 'null'
  //TODO: 'resolve' callback is 'undefined', 'null'
  //TODO: 'reject' callback is 'undefined', 'null'
  //TODO: 'this' is correct in each callback when executing a promise
})();
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
    var value = 4241;
    var errorMessage = "Error occurred";

    var result = [];

    new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(value);
      }, 500);
    }).then(function() {
        throw new Error(errorMessage);
    }).then(function(value) {}, function(error) {
      equal(errorMessage, error.message, "onRejected callback is called in case error is thrown");
      return error;
    }).then(function(value) {
      deepEqual(errorMessage, value.message, "Value passed to onRejected callback becomes the value the promise created by 'then' resolves to");
      start();
    });
  });

  //TODO: Exception thrown in the body of the initial promise
  //TODO: Exception both in the body of the initial promise and the resolve callback
  //TODO: Exception thrown in the reject callback

  //TODO: Chaining one of the promises is rejected

  //TODO: 'this' is correct in each callback when executing a promise
  //TODO: Error is thrown in the constructor, then it is passed to "reject"
})();
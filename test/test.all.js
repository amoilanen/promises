module("jsPromise.all");

(function() {

  function resolvingPromise(resolveValue) {
    return new Promise(function(resolve, reject) {
      resolve(resolveValue);
    });
  }

  function resolvingPromiseWithTimeout(resolveValue, timeout) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(resolveValue);
      }, timeout);
    });
  }

  asyncTest("Promise.all resolves when all argument promises resolve", function() {
    var allPromises = [resolvingPromise("a"), resolvingPromise("b"), resolvingPromise("c")];

    Promise.all(allPromises).then(function(value) {
      deepEqual(value, ["a", "b", "c"], "Resolves when all the promises resolve");
      start();
    });
  });

  asyncTest("Promise.all keeps the order of asynchronous argument promises in the resolved value", function() {
    var allPromises = [
      resolvingPromiseWithTimeout("a", 1500),
      resolvingPromiseWithTimeout("b", 1000),
      resolvingPromiseWithTimeout("c", 500)
    ];

    Promise.all(allPromises).then(function(value) {
      deepEqual(value, ["a", "b", "c"], "The order is the order of promise arguments");
      start();
    });
  });

  asyncTest("Promise.all with one promise is equivalent to that promise", function() {
    Promise.all([resolvingPromise("a")]).then(function(value) {
      deepEqual(value, ["a"], "Same as the single argument promise");
      start();
    });
  });

  asyncTest("Promise.all with empty array of promises resolves to 'undefined'", function() {
    Promise.all([]).then(function(value) {
      equal(value, void 0, "Resolves to 'undefined' value");
      start();
    });
  });

  asyncTest("Promise.all with no arguments resolves to 'undefined'", function() {
    Promise.all().then(function(value) {
      equal(value, void 0, "Resolves to 'undefined' value");
      start();
    });
  });

  asyncTest("Promise.all with 'null' argument resolves to 'undefined'", function() {
    Promise.all(null).then(function(value) {
      equal(value, void 0, "Resolves to 'undefined' value");
      start();
    });
  });

  asyncTest("Promise.all accepts only one array argument, otherwise rejects", function() {
    var errorMessage = "Promise.all: invalid arguments";

    Promise.all(
      resolvingPromise("a"),
      resolvingPromise("b"),
      resolvingPromise("c")).then(function(resolvedValue) {
      ok(false, "Should not resolve if the argument is not an array");
      start();
    }, function(rejectedValue) {
      equal(rejectedValue.message, errorMessage, "Rejects with error message");
      start();
    });
  });

  //TODO: Rejects if one of the promises rejects, the value is the first rejected value
  //TODO: Array can be array of promises intermixed with promise-like objects and values
})();
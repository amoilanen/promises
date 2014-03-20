module("jsPromise.all");

(function() {

  function resolvingPromise(value, timeout) {
    return new Promise(function(resolve, reject) {
      if (timeout) {
        setTimeout(function() {
          resolve(value);
        }, timeout);
      } else {
        resolve(value);
      }
    });
  }

  function rejectingPromise(value, timeout) {
    return new Promise(function(resolve, reject) {
      if (timeout) {
        setTimeout(function() {
          reject(value);
        }, timeout);
      } else {
        reject(value);
      }
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
      resolvingPromise("a", 1500),
      resolvingPromise("b", 1000),
      resolvingPromise("c", 500)
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
    var errorMessage = "Invalid arguments";

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

  asyncTest("Promise.all rejects if one of the promises rejects", function() {
    var allPromises = [
      resolvingPromise("a"),
      resolvingPromise("b"),
      rejectingPromise("c"),
      resolvingPromise("d"),
      resolvingPromise("e")
    ];

    Promise.all(allPromises).then(function(resolvedValue) {
      ok(false, "Should not be resolved");
      start();
    }, function(rejectedValue) {
      equal(rejectedValue, "c", "Rejected value from the first rejecting promise is returned");
      start();
    });
  });

  asyncTest("Promise.all rejects if all of the promises rejects", function() {
    var allPromises = [
      rejectingPromise("a", 1500),
      rejectingPromise("b", 1000),
      rejectingPromise("c", 500)
    ];

    Promise.all(allPromises).then(function(resolvedValue) {
      ok(false, "Should not be resolved");
      start();
    }, function(rejectedValue) {
      equal(rejectedValue, "c", "Rejects with the value of the first rejected promise");
      start();
    });
  });

  asyncTest("Promise.all rejecting promise is executed after the first rejected promise", function() {
    var rejectedValue = "rejectedValue";
    var x = new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(rejectedValue);
        ok(true, "The rejecting promise is still executed");
        start();
      }, 1000);
    });
    var allPromises = [
      rejectingPromise("a"),
      x
    ];

    Promise.all(allPromises).then(function(resolvedValue) {
      ok(false, "Promise.all should not be resolved");
      start();
    }, function(rejectedValue) {});
  });

  asyncTest("Promise.all resolving promise is executed after the first rejected promise", function() {
    var resolvedValue = "resolvedValue";
    var x = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(resolvedValue);
        ok(true, "The resolving promise is still executed");
        start();
      }, 1000);
    });
    var allPromises = [
      rejectingPromise("a"),
      x
    ];

    Promise.all(allPromises).then(function(resolvedValue) {
      ok(false, "Promise.all should not be resolved");
      start();
    }, function(rejectedValue) {});
  });

  asyncTest("Promise.all if one of the values is not a promise it is cast to a promise", function() {
    var allPromises = [resolvingPromise("a"), "b", resolvingPromise("c")];

    Promise.all(allPromises).then(function(value) {
      deepEqual(value, ["a", "b", "c"], "Resolves when all the promises resolve");
      start();
    });
  });

  asyncTest("Promise.all if one of the values is a promise-like object it is cast to a promise", function() {
    var resolvingPromiseLikeObject = {
      then: function(resolve, reject) {
        resolve("b");
      }
    };
    var allPromises = [resolvingPromise("a"), resolvingPromiseLikeObject, resolvingPromise("c")];

    Promise.all(allPromises).then(function(value) {
      deepEqual(value, ["a", "b", "c"], "Resolves when all the promises resolve");
      start();
    });
  });
})();
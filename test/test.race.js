module("jsPromise.race");

(function() {

  function resolvingPromise(value, timeout) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(value);
      }, timeout);
    });
  }

  function rejectingPromise(value, timeout) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(value);
      }, timeout);
    });
  }

  asyncTest("Promise.race resolves if first promise resolves", function() {
    var allPromises = [
      rejectingPromise("a", 1500),
      resolvingPromise("b", 1000),
      resolvingPromise("c", 500)
    ];

    Promise.race(allPromises).then(function(value) {
      deepEqual(value, "c", "Resolves to value of first resolving promise");
      start();
    });
  });

  asyncTest("Promise.race rejects if first promise rejects", function() {
    var allPromises = [
      resolvingPromise("a", 1500),
      resolvingPromise("b", 1000),
      rejectingPromise("c", 500)
    ];

    Promise.race(allPromises).then(function(){}, function(value) {
      deepEqual(value, "c", "Rejects with the value of the first rejected promise");
      start();
    });
  });

  asyncTest("Promise.race with one promise is equivalent to that promise", function() {
    Promise.race([resolvingPromise("a")]).then(function(value) {
      deepEqual(value, "a", "Same as the single argument promise");
      start();
    });
  });

  asyncTest("Promise.race with empty array of promises resolves to 'undefined'", function() {
    Promise.race([]).then(function(value) {
      equal(value, void 0, "Resolves to 'undefined' value");
      start();
    });
  });

  asyncTest("Promise.race with no arguments resolves to 'undefined'", function() {
    Promise.race().then(function(value) {
      equal(value, void 0, "Resolves to 'undefined' value");
      start();
    });
  });

  asyncTest("Promise.race with 'null' argument resolves to 'undefined'", function() {
    Promise.race(null).then(function(value) {
      equal(value, void 0, "Resolves to 'undefined' value");
      start();
    });
  });

  asyncTest("Promise.race accepts only one array argument, otherwise rejects", function() {
    var errorMessage = "Invalid arguments";

    Promise.race(
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

  asyncTest("Promise.race all the promises are executed after the first one", function() {
    var resolvedValue = "resolvedValue";
    var x = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(resolvedValue);
        ok(true, "The remaining promise is still executed");
        start();
      }, 1000);
    });
    var allPromises = [
      resolvingPromise("a"),
      x
    ];

    Promise.race(allPromises).then(function(value) {
      equal(value, "a", "Promise.race is resolved");
    });
  });

  asyncTest("Promise.race values are cast to promises", function() {
    var allPromises = ["a", "b", resolvingPromise("c")];

    Promise.race(allPromises).then(function(value) {
      equal(value, "a", "Resolves to first value");
      start();
    });
  });

  asyncTest("Promise.race promise-like objects are cast to promises", function() {
    var resolvingPromiseLikeObject = function(value) {
      return {
        then: function(resolve, reject) {
          resolve(value);
        }
      };
    };
    var allPromises = [resolvingPromiseLikeObject("a"), resolvingPromiseLikeObject("b"), resolvingPromise("c")];

    Promise.race(allPromises).then(function(value) {
      equal(value, "a", "Resolves to first value");
      start();
    });
  });
})();
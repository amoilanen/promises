module("jsPromise.resolve");

(function() {

  asyncTest("Promise.resolve resolves object to promise", function() {
    var resolvedValue = "resolvedValue";

    Promise.resolve(resolvedValue).then(function(value) {
      equal(resolvedValue, value, "Value is resolved as promise");
      start();
    });
  });

  asyncTest("Promise.resolve resolves resolving promise-like object with 'then' to promise", function() {
    var resolvedValue = "resolvedValue";
    var resolvingPromiseLikeObject = {
      then: function(resolve, reject) {
        resolve(resolvedValue);
      }
    };

    Promise.resolve(resolvingPromiseLikeObject).then(function(value) {
      equal(value, resolvedValue, "Promise-like object is resolved as promise");
      start();
    });
  });

    asyncTest("Promise.resolve resolves rejecting promise-like object with 'then' to promise", function() {
    var rejectedValue = "rejectedValue";
    var rejectingPromiseLikeObject = {
      then: function(resolve, reject) {
        reject(rejectedValue);
      }
    };

    Promise.resolve(rejectingPromiseLikeObject).then(function() {}, function(value) {
      equal(value, rejectedValue, "Promise-like object is resolved as promise");
      start();
    });
  });

  asyncTest("Promise.resolve resolves asynchronous promise-like object with 'then' to promise", function() {
    var resolvedValue = "resolvedValue";
    var resolvingPromiseLikeObject = {
      then: function(resolve, reject) {
        setTimeout(function() {
          resolve(resolvedValue);
        }, 500);
      }
    };

    Promise.resolve(resolvingPromiseLikeObject).then(function(value) {
      equal(value, resolvedValue, "Promise-like object is resolved as promise");
      start();
    });
  });

  asyncTest("Promise.resolve called with a promise returns a new equivalent promise", function() {
    var resolveValue = "resolveValue";
    var originalPromise = new Promise(function(resolve, reject) {
      resolve(resolveValue);
    });
    var resolvedPromise = Promise.resolve(originalPromise);

    notEqual(resolvedPromise, originalPromise, "Another promise object is returned");
    resolvedPromise.then(function(value) {
      equal(value, resolveValue, "After resolving the promise still works");
      start();
    });
  });

  //TODO: Promise-like object has an asychronous 'then'
})();
module("jsPromise.reject");

(function() {

  asyncTest("Promise.reject casts object to rejecting promise", function() {
    var rejectedValue = "rejectedValue";

    Promise.reject(rejectedValue).then(function() {}, function(value) {
      equal(rejectedValue, value, "Value is cast as promise");
      start();
    });
  });

  asyncTest("Promise.reject casts Error instance to rejecting promise", function() {
    var rejectedValue = new Error("errorText");

    Promise.reject(rejectedValue).then(function() {}, function(value) {
      equal(rejectedValue, value, "Value is cast as promise");
      start();
    });
  });

  asyncTest("Promise.reject casts promise-like object with 'then' to rejecting promise", function() {
    var resolvedValue = "resolvedValue";
    var promiseLikeObject = {
      then: function(resolve, reject) {
        resolve(resolvedValue);
      }
    };

    Promise.reject(promiseLikeObject).then(function() {}, function(value) {
      equal(value, promiseLikeObject, "Promise-like object is returned as value");
      start();
    });
  });

  asyncTest("Promise.reject called with a promise returns a rejecting promise", function() {
    var resolveValue = "resolveValue";
    var originalPromise = new Promise(function(resolve, reject) {
      resolve(resolveValue);
    });
    var rejectedPromise = Promise.reject(originalPromise);

    notEqual(rejectedPromise, originalPromise, "Another promise object is returned");
    rejectedPromise.then(function() {}, function(value) {
      equal(value, originalPromise, "After rejecting the promise still works");
      start();
    });
  });
})();
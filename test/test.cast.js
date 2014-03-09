module("jsPromise.cast");

(function() {

  asyncTest("Promise.cast casts object to promise", function() {
    var resolvedValue = "resolvedValue";

    Promise.cast(resolvedValue).then(function(value) {
      equal(resolvedValue, value, "Value is casted as promise");
      start();
    });
  });

  asyncTest("Promise.cast with a promise like object with 'then' returns that object", function() {
    var resolvedValue = "resolvedValue";
    var resolvingPromiseLikeObject = {
      then: function(resolve, reject) {
        resolve(resolvedValue);
      }
    };

    Promise.cast(resolvingPromiseLikeObject).then(function(value) {
      equal(value, resolvingPromiseLikeObject, "Original promise-like object is returned");
      start();
    });
  });

  asyncTest("Promise.cast called with a promise returns that promise", function() {
    var resolveValue = "resolveValue";
    var originalPromise = new Promise(function(resolve, reject) {
      resolve(resolveValue);
    });
    var castedPromise = Promise.cast(originalPromise);

    equal(castedPromise, originalPromise, "Same promise object is returned");
    castedPromise.then(function(value) {
      equal(value, resolveValue, "After casting the promise still works");
      start();
    });
  });
})();
module("jsPromise.cast");

(function() {

  asyncTest("Promise.cast casts object to promise", function() {
    var resolvedValue = "resolvedValue";

    Promise.cast(resolvedValue).then(function(value) {
      equal(resolvedValue, value, "Value is casted as promise");
      start();
    });
  });

  asyncTest("Promise.cast casts resolving promise-like object with 'then' to promise", function() {
    var resolvedValue = "resolvedValue";
    var resolvingPromiseLikeObject = {
      then: function(resolve, reject) {
        resolve(resolvedValue);
      }
    };

    Promise.cast(resolvingPromiseLikeObject).then(function(value) {
      equal(value, resolvedValue, "Promise-like object is casted as promise");
      start();
    });
  });

    asyncTest("Promise.cast casts rejecting promise-like object with 'then' to promise", function() {
    var rejectedValue = "rejectedValue";
    var rejectingPromiseLikeObject = {
      then: function(resolve, reject) {
        reject(rejectedValue);
      }
    };

    Promise.cast(rejectingPromiseLikeObject).then(function() {}, function(value) {
      equal(value, rejectedValue, "Promise-like object is casted as promise");
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

  //TODO: "resolve" should be an alias for "cast"
  //TODO: Promise-like object has an asychronous 'then'
})();
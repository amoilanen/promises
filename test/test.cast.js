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

  //TODO: Promise-like object has an asychronous 'then'
})();
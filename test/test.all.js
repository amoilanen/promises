module("jsPromise.all");

(function() {

  function resolvingPromise(resolveValue) {
    return new Promise(function(resolve, reject) {
      resolve(resolveValue);
    });
  }

  asyncTest("Promise.cast called with a promise returns that promise", function() {
    var allPromises = [resolvingPromise("a"), resolvingPromise("b"), resolvingPromise("c")];

    Promise.all(allPromises).then(function(value) {
      deepEqual(value, ["a", "b", "c"], "Resolves when all the promises resolve");
      start();
    });
  });

  //TODO: The order of values that were resolved corresponds to the order in which promises are passed to 'all'
  //TODO: One argument to 'all'
  //TODO: No arguments to 'all'
  //TODO: Rejects if one of the promises rejects, the value is the first rejected value
  //TODO: Array can be array of promises intermixed with promise-like objects and values
  //TODO: Asynchronous promises listed in arguments to "all"
})();
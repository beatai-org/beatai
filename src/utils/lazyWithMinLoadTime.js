/**
 * Lazy-load helper with an optional minimum loader duration.
 *
 * @param {Function} importFunc - Dynamic import function.
 * @param {number} minLoadTime - Optional minimum load time in ms.
 * @returns {Promise} Component import promise.
 */
export const lazyWithMinLoadTime = (importFunc, minLoadTime = 0) => {
  return new Promise((resolve) => {
    const startTime = Date.now();

    importFunc().then((module) => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);

      setTimeout(() => {
        resolve(module);
      }, remaining);
    });
  });
};

export default lazyWithMinLoadTime;

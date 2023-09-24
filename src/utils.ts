/**
 * Determine whether the given `promise` is a Promise.
 *
 * @param {*} promise
 *
 * @returns {Boolean}
 */
export const isPromise = (promise: any) =>
  promise instanceof Promise ||
  (!!promise && typeof promise?.then === 'function');

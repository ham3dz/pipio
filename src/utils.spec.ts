import { isPromise } from './utils';

describe('utils', () => {
  describe('isPromise', () => {
    it('ensure isPromise is always a function', () => {
      expect(typeof isPromise).toBe('function');
    });

    it('should return true for promise', () => {
      [
        new Promise(() => undefined),
        {
          then: () => undefined,
        },
      ].forEach((_) => expect(isPromise(_)).toBe(true));
    });

    it('should return false for anything else', () => {
      [1, '', true, {}, [], () => undefined, undefined, null].forEach((_) =>
        expect(isPromise(_)).toBe(false)
      );
    });
  });
});

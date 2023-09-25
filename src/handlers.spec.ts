import { lambdaWrapper } from './handlers';

describe('handlers', () => {
  describe('lambdaWrapper', () => {
    it('should pack the first two arguments of array to an object', () => {
      const fn = lambdaWrapper();

      const x = fn([{ event: true }, { context: true }]);

      expect(x.event).toStrictEqual({ event: true });
      expect(x.context).toStrictEqual({ context: true });
    });
  });
});

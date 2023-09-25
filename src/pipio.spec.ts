import { pipio } from './pipio';

describe('pipio', () => {
  describe('sync', () => {
    it('single handler pipe', () => {
      const handler = pipio((args: Array<any>) => args).build();
      expect(handler(1, 2, 3, 4)).resolves.toStrictEqual([1, 2, 3, 4]);
    });

    it('multiple handler pipe', () => {
      const handler = pipio((args: Array<any>) => args)
        .use((args) => args.reverse())
        .build();

      expect(handler(1, 2, 3, 4)).resolves.toStrictEqual([4, 3, 2, 1]);
    });

    it('multiple handler pipe w/ error handler', () => {
      const handler = pipio(() => undefined)
        .use(() => {
          throw new Error('Failed');
        })
        .build({ onError: (e) => e });

      expect(handler()).resolves.toBeInstanceOf(Error);
    });

    it('multiple handler pipe w/ error handler (error mapper)', () => {
      const handler = pipio(() => undefined)
        .use(() => {
          throw new Error('Failed');
        })
        .build({ onError: (e: Error) => ({ message: e.message }) });

      expect(handler(1, 2, 3, 4)).resolves.toStrictEqual({
        message: 'Failed',
      });
    });

    it('multiple handler pipe w/o error handler', () => {
      const handler = pipio(() => undefined)
        .use(() => {
          throw Error('Failed');
        })
        .build();

      expect(handler()).rejects.toThrow('Failed');
    });
  });

  describe('async', () => {
    it('single handler pipe', () => {
      const handler = pipio(async (args: Array<any>) => args).build();
      expect(handler(1, 2, 3, 4)).resolves.toStrictEqual([1, 2, 3, 4]);
    });

    it('multiple handler pipe', () => {
      const handler = pipio(async (args: Array<any>) => args)
        .use(async (args) => args.reverse())
        .build();

      expect(handler(1, 2, 3, 4)).resolves.toStrictEqual([4, 3, 2, 1]);
    });

    it('multiple handler pipe w/ error handler', () => {
      const handler = pipio(async () => undefined)
        .use(async () => {
          throw new Error('Failed');
        })
        .build({ onError: (e) => e });

      expect(handler()).resolves.toBeInstanceOf(Error);
    });

    it('multiple handler pipe w/ error handler (error mapper)', () => {
      const handler = pipio(async () => undefined)
        .use(async () => {
          throw new Error('Failed');
        })
        .build({ onError: (e: Error) => ({ message: e.message }) });

      expect(handler(1, 2, 3, 4)).resolves.toStrictEqual({
        message: 'Failed',
      });
    });

    it('multiple handler pipe w/o error handler', () => {
      const handler = pipio(() => undefined)
        .use(() => {
          throw Error('Failed');
        })
        .build();

      expect(handler()).rejects.toThrow('Failed');
    });
  });
});

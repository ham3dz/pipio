import { pipio } from './pipio';

describe('pipio', () => {
  describe('sync', () => {
    it('single handler pipe', () => {
      const handler = pipio((args: Array<any>) => args).build();
      expect(handler(1, 2, 3, 4)).resolves.toStrictEqual([1, 2, 3, 4]);
    });

    it('use factory to create handler', () => {
      const factory1 = () => (args: Array<any>) => args.reverse();

      const handler = pipio((args: Array<any>) => args)
        .use(factory1())
        .build();

      expect(handler(1, 2, 3, 4)).resolves.toStrictEqual([4, 3, 2, 1]);
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

    it('use factory to create handler', async () => {
      const factory1 = async () => (args: Array<any>) => args.reverse();

      const handler = pipio((args: Array<any>) => args)
        .use(await factory1())
        .build();

      expect(handler(1, 2, 3, 4)).resolves.toStrictEqual([4, 3, 2, 1]);
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

  describe('combined sync/async', () => {
    it('multiple handler pipe', () => {
      const handler = pipio((args: Array<any>) => [1, 2, 3])
        .use(async (args) => args)
        .use((args) => 'hi there')
        .use(async (message) => `Hello ${message}`)
        .build();

      expect(handler()).resolves.toStrictEqual('Hello hi there');
    });

    it('multiple handler pipe w/ error handler', () => {
      const handler = pipio((args: Array<any>) => [1, 2, 3])
        .use(async (args) => args)
        .use((args) => 'hi there')
        .use(async (message) => `Hello ${message}`)
        .use(async () => {
          throw new Error('Failed');
        })
        .build({ onError: (e) => e });

      expect(handler()).resolves.toBeInstanceOf(Error);
    });

    it('multiple handler pipe w/ error handler (error mapper)', () => {
      const handler = pipio((args: Array<any>) => [1, 2, 3])
        .use(async (args) => args)
        .use((args) => 'hi there')
        .use(async (message) => `Hello ${message}`)
        .use(async () => {
          throw new Error('Failed');
        })
        .build({ onError: (e: Error) => ({ message: e.message }) });

      expect(handler()).resolves.toStrictEqual({
        message: 'Failed',
      });
    });

    it('multiple handler pipe w/o error handler', () => {
      const handler = pipio((args: Array<any>) => [1, 2, 3])
        .use(async (args) => args)
        .use((args) => 'hi there')
        .use(async (message) => `Hello ${message}`)
        .use(() => {
          throw Error('Failed');
        })
        .build();

      expect(handler()).rejects.toThrow('Failed');
    });
  });
});

import { isPromise } from './utils';

export type PipioHandler<T, U> = (req: T) => U;
export type AsyncPipioHandler<T, U> = (req: T) => Promise<U>;

export type BuildParams = {
  /**
   * Error handler
   * @param {Error|unknown} err Thrown error object
   * @returns The pipeline output or throw error
   */
  onError?: (err: Error | unknown) => any;
};

export class Pipio<U> {
  constructor(
    protected readonly handlers: [
      ...PipioHandler<any, any>[],
      PipioHandler<any, U>
    ]
  ) {}

  /**
   * Add a new middleware to the pipeline
   * @param fn Middleware function
   * @returns {Pipio} A new instance of the pipio with the handler setup
   */
  use<TNextResponse>(fn: PipioHandler<U, TNextResponse>) {
    return new Pipio<TNextResponse>([...this.handlers, fn]);
  }

  /**
   * Build the pipeline and create a callable function
   * @param params Build-time parameters
   * @returns The wrapper function of the pipeline
   */
  build(params?: BuildParams) {
    return async (...args: any[]) => {
      let output: any = args;

      for (const fn of this.handlers) {
        try {
          // call the function with the previous call result
          const handlerResult = fn(output);

          // if handler returns a promise, the we need to wait,
          // otherwise, we're good to go
          if (isPromise(handlerResult) === true) {
            output = await handlerResult;
          } else {
            output = handlerResult;
          }
        } catch (e) {
          // user handles the error, pass the error to their handler
          if (typeof params?.onError === 'function') {
            return params?.onError(e);
          }

          // no handler found, throw error
          throw e;
        }
      }

      // no more item in the stack
      if (this.handlers.length === 0) {
        output = undefined;
      }

      return output;
    };
  }
}

/**
 * pipio create factory
 * @param fn Main middleware
 * @returns {Pipio} A new instance of pipio with the first handler configured
 */
export const pipio = <U>(fn: PipioHandler<any[], U>): Pipio<U> => {
  return new Pipio([fn]);
};

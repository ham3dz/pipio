import { PipioHandler } from './pipio';

/**
 * Lambda wrapper middleware
 * Convert lambda handler arguments to pipio compatible arguments
 * @returns A pipio handlers
 */
export const lambdaWrapper = <TEvent = any, TContext = any>(): PipioHandler<
  Array<any>,
  { event: TEvent; context: TContext }
> => {
  return async (args: Array<any>) => {
    return {
      event: args[0] as TEvent,
      context: args[1] as TContext,
    };
  };
};

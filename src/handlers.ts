import { SyncPipioHandler } from './pipio';

export type LambdaWrapperOutput<TEvent, TContext> = {
  event: TEvent;
  context: TContext;
};

/**
 * Lambda wrapper middleware
 * Convert lambda handler arguments to pipio compatible arguments
 * @returns A pipio handlers
 */
export const lambdaWrapper =
  <TEvent = any, TContext = any>(): SyncPipioHandler<
    Array<any>,
    LambdaWrapperOutput<TEvent, TContext>
  > =>
  (args: Array<any>) => ({
    event: args[0] as TEvent,
    context: args[1] as TContext,
  });

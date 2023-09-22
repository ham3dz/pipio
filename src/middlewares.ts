export const lambdaWrapperMiddleware = <TEvent = any, TContext = any>() => {
  return async (args: any[]) => {
    return {
      event: args[0] as TEvent,
      context: args[1] as TContext,
    };
  };
};

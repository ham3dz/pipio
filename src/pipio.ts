export type ChainHandler<TRequest, TResponse, TContext> = (
  req: TRequest,
  ctx: TContext
) => Promise<TResponse> | void;

export type BuildParams = {
  onError?: (err: unknown) => any;
  buildContext?: (...args: any[]) => any;
};

export class Pipio<TResponse, TContext> {
  constructor(
    private readonly stack: [
      ...ChainHandler<any, any, any>[],
      ChainHandler<any, TResponse, any>
    ]
  ) {}

  use<TNextResponse, TNewContext = TContext>(
    fn: ChainHandler<TResponse, TNextResponse, TContext>
  ) {
    return new Pipio<TNextResponse, TNewContext>([...this.stack, fn]);
  }

  build(params?: BuildParams) {
    return async (...args: any[]) => {
      const firstArgument = args[0];
      let result: any = firstArgument;

      const context = params?.buildContext ? params.buildContext(args) : {};

      for (const fn of this.stack) {
        try {
          result = await fn(result, context);
        } catch (e) {
          if (params?.onError) {
            return params?.onError(e);
          }

          throw e;
        }
      }

      if (this.stack.length === 0) {
        return undefined;
      }

      return result;
    };
  }
}

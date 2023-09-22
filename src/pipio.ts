export type ChainHandler<TRequest, TResponse> = (
  req: TRequest
) => Promise<TResponse> | void;

export type BuildParams<TResponse> = {
  onError?: (err: unknown) => any;
  onSuccess?: (result: TResponse) => any;
};

export class Pipio<TResponse> {
  constructor(
    private readonly stack: [
      ...ChainHandler<any, any>[],
      ChainHandler<any, TResponse>
    ]
  ) {}

  use<TNextResponse>(fn: ChainHandler<TResponse, TNextResponse>) {
    return new Pipio<TNextResponse>([...this.stack, fn]);
  }

  build(params?: BuildParams<TResponse>) {
    return async (...args: any[]) => {
      let result: any = args;

      for (const fn of this.stack) {
        try {
          result = await fn(result);
        } catch (e) {
          if (params?.onError) {
            return params?.onError(e);
          }

          throw e;
        }
      }

      if (this.stack.length === 0) {
        result = undefined;
      }

      if (params?.onSuccess) {
        result = params.onSuccess(result);
      }

      return result;
    };
  }
}

export const pipio = <TResponse>(fn: ChainHandler<any[], TResponse>) => {
  return new Pipio([fn]);
};

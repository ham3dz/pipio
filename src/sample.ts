import { lambdaWrapperMiddleware } from "./middlewares";
import { pipio } from "./pipio";

const bootstrapMiddleware = () => {
  let connection = undefined;
  let service = {};

  return async (args: any[]) => {
    const [event, lambdaContext] = args;

    return {
      services: service,
      event,
      context: lambdaContext,
    };
  };
};

const handler = pipio(lambdaWrapperMiddleware<string, {}>())
  .use(async ({ event, context }) => {})
  .build({
    onError: (e) => {},
  });

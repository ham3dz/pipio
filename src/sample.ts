import { Pipio } from "./pipio";

const handler = new Pipio([
  async (req, ctx) => {

    return {
      data1: 22,
    };
  },
])
  .use(async (req) => {
    return {
      data2: "string",
    };
  })
  .build({
    buildContext: (...args: any[]) => {
      return {
        logger: console.log,
      };
    },
  });

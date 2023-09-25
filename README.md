# pipio

[![NPM version][npm-image]](https://github.com/ham3dz/pipio)
[![NPM downloads][downloads-image]](https://github.com/ham3dz/pipio)
[![Build Status][github-actions-publish-npm-package]](https://github.com/ham3dz/pipio/actions/workflows/publish_npm_package.yml)

## About

Pipio helps developers compose complex business logic from reusable blocks of code (functions) in sync and async manner.

## Installation

To install this package, run the command below.

```sh
# npm
npm install pipio

# yarn
yarn add pipio

# pnpm
pnpm add pipio
```

## Usage

### CommonJS

```js
const { pipio } = require('./pipio');

const handler = pipio(async () => {
  // bootstrap application
  return { serviceName: 'S1', logger: console.log };
  })
  // step 1
  .use(async ({ serviceName, logger }) => {
    logger(`${serviceName} is called`);

    return { serviceName, logger, result: { id: 123, title: 'Todo 1' } };
  })
  // step 2
  .use(async ({ serviceName, logger, result }) => {
    logger(`${serviceName} is called`);

    return { status: 200, body: result }
  })
  .build({
    onError: (err) => {

      if (err instanceof BadRequestError) {

        return {
          status: 400,
          body: 'ValidationFailed'
        }
      }

      return {
        status: 500,
        body: 'Failed'
      }
    },
  });
```

### ESModule (TypeScript/ES6+)

```js
import { pipio } from './pipio';

const handler = pipio(async () => {
  // bootstrap application
  return { serviceName: 'S1', logger: console.log };
  })
  // step 1
  .use(async ({ serviceName, logger }) => {
    logger(`${serviceName} is called`);

    return { serviceName, logger, result: { id: 123, title: 'Todo 1' } };
  })
  // step 2
  .use(async ({ serviceName, logger, result }) => {
    logger(`${serviceName} is called`);

    return { status: 200, body: result }
  })
  .build({
    onError: (err) => {

      if (err instanceof BadRequestError) {

        return {
          status: 400,
          body: 'ValidationFailed'
        }
      }

      return {
        status: 500,
        body: 'Failed'
      }
    },
  });
```

## Examples

### Example 1

Without pipio, your handler would be like this.

- Unnecessary variable declaration
- Complicated error handling (e.g. multiple early returns, not accessing to variables due to variable scope in a try/catch block)
- Not testable
- Hard to maintain

```js
const handler = async (event, context) => {
  // initialize application (1-time operation)
  const { validator, database, notification } = await bootstrap();

  // parse JSON
  const parsedResponse = JSON.parse(event.body);

  // validate input
  if (validator.isValid(parsedResponse) === false) {
    return {
      status: 400,
    };
  }

  // save in database
  const savedItem = await database.save(parsedResponse);

  // notify others
  await notification.send({ event: 'item.created', item: savedItem });

  // map response
  return {
    status: 200,
    body: savedItem,
  };
};
```

With pipio, your handler would be like this

```js
const handler = pipio(lambdaWrapper())
  // bootstrap
  .use(async (opts) => {
    // destructure the opts parameter
    const { event, context } = opts;

    // initialize application (1-time operation)
    const { validator, database, notification } = await bootstrap();

    return { event, context, validator, database, notification };
  })
  // parse JSON
  .use(async (opts) => {
    try {
      // parse JSON
      const parsedResponse = JSON.parse(event.body);
    } catch (err) {
      throw new Error('MalformedJSON');
    }

    return { ...opts, parsedResponse };
  })
  // validate input
  .use(async (opts) => {
    // destructure the opts parameter
    const { event, parsedResponse, validator } = opts;

    if (validator.isValid(parsedResponse) === false) {
      throw new Error('BadRequest');
    }

    return opts;
  })
  // save in database
  .use(async (opts) => {
    // destructure the opts parameter
    const { database, parsedResponse } = opts;

    // save in database
    const savedItem = await database.save(parsedResponse);

    return { ...opts, savedItem };
  })
  // notify others
  .use(async (opts) => {
    // destructure the opts parameter
    const { notification, savedItem } = opts;

    // notify others
    await notification.send({ event: 'item.created', item: savedItem });

    return opts;
  })
  // map response
  .use(async (opts) => {
    // destructure the opts parameter
    const { savedItem } = opts;

    return {
      status: 200,
      body: savedItem,
    };
  })
  // convert to handler
  .build({
    onError: (err) => {},
  });
```


And you're good to go!

## License

MIT

[npm-image]: https://img.shields.io/npm/v/pipio
[npm-url]: https://github.com/ham3dz/pipio
[github-actions-publish-npm-package]: https://github.com/ham3dz/pipio/actions/workflows/publish_npm_package.yml/badge.svg
[downloads-image]: https://img.shields.io/npm/dw/pipio
[downloads-url]: https://github.com/ham3dz/pipio

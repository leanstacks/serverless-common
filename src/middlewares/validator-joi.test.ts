import { jest } from '@jest/globals';
import { Request } from '@middy/core';
import * as Joi from 'joi';
import { BadRequestError } from '../errors/bad-request.error';

import { validator } from './validator-joi';
import { requestFixture } from '../__fixtures__/middy.fixture';

describe('JoiValidator', () => {
  const schema = Joi.object({
    s: Joi.string().required(),
    b: Joi.boolean().default(false),
    n: Joi.number().default(1),
  });

  it('should create the middleware', () => {
    const middleware = validator({ eventSchema: schema });

    expect(middleware.before).toBeDefined();
  });

  it('should write log when logger provided', () => {
    type loggerFn = (msg: string) => void;
    const mockLogger = jest.fn<loggerFn>();

    const request: Request = {
      ...requestFixture,
      event: {
        s: 'string',
        b: 'true',
        n: '100',
      },
    };
    const middleware = validator({ eventSchema: schema, logger: mockLogger });

    middleware.before?.(request);

    expect(mockLogger).toHaveBeenCalled();
  });

  it('should validate successfully', () => {
    const request: Request = {
      ...requestFixture,
      event: {
        s: 'string',
        b: 'true',
        n: '100',
      },
    };
    const middleware = validator({ eventSchema: schema });

    expect(middleware.before).toBeDefined();

    if (middleware.before) {
      middleware.before(request);

      expect(request.event).toBeDefined();
      expect(request.event.s).toBe('string');
      expect(request.event.b).toBe(true);
      expect(request.event.n).toBe(100);
    }
  });

  it('should throw error on validation failure', () => {
    const validate = () => {
      const request: Request = {
        ...requestFixture,
        event: {
          s: 1,
        },
      };
      const middleware = validator({ eventSchema: schema });
      middleware.before && middleware.before(request);
    };

    expect(validate).toThrow(BadRequestError);
  });
});

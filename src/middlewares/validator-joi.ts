import middy, { MiddlewareObj } from '@middy/core';
import * as Joi from 'joi';

import Logger from '../utils/logger';
import { BadRequestError } from '../errors/bad-request.error';

/**
 * ValidatorOptions
 */
export type ValidatorOptions = {
  eventSchema?: Joi.ObjectSchema;
};

/**
 * Joi ValidationOptions
 */
const validationOptions: Joi.ValidationOptions = {
  abortEarly: false,
  allowUnknown: true,
};

/**
 * Validate Lambda events with a Joi schema.
 * @param options - Options for the validator.
 * @returns Middleware to perform validation against a Joi schema.
 */
export const validator = (options: ValidatorOptions): MiddlewareObj => {
  /**
   * Validate a `value` using a Joi `schema`.
   * @param schema - Joi schema
   * @param value - The value to be validated
   * @returns The Joi validation result.
   * @throws A Joi `ValidationError` if validation fails.
   */
  const validate = (schema: Joi.ObjectSchema, value: object) => {
    return schema.validate(value, validationOptions);
  };

  /**
   * Perform validation before the handler is invoked.
   * @param request - Middy request context.
   */
  const before: middy.MiddlewareFn = (request): void => {
    Logger.debug(`middleware::validator::before`);
    if (options.eventSchema) {
      const { error, value } = validate(options.eventSchema, request.event);
      if (error) {
        Logger.error(`middleware::validator::error::${error}`);
        throw new BadRequestError(error.message);
      }
      request.event = {
        ...request.event,
        ...value,
      };
    }
  };

  return { before };
};

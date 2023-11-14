import middy, { MiddlewareObj } from '@middy/core';
import * as Joi from 'joi';
import { BadRequestError } from '../errors';

/**
 * ValidatorOptions
 */
export type ValidatorOptions = {
  eventSchema?: Joi.ObjectSchema;
  logger?(message: string): void;
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
   * Write a message to the application log.
   * @param message string - The message to write.
   */
  const log = (message: string): void => {
    if (options.logger) {
      options.logger(message);
    }
  };

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
    log(`middleware::validator::before`);
    if (options.eventSchema) {
      const { error, value } = validate(options.eventSchema, request.event);
      if (error) {
        log(`validation error::${error}`);
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

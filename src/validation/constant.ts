import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const validateString = Joi.string();
export const requiredString = validateString.required();

export const validateEmail = validateString.email();
export const requiredEmail = validateEmail.required();

export const validateNumber = Joi.number();
export const requiredNumber = validateNumber.required();

export const validateInteger = validateNumber.integer();
export const requiredInteger = validateInteger.required();

export const schemaOptions = {
  errors: {
    wrap: {
      label: '',
    },
  },
};

export const commonGetSchema = Joi.object({
  page: validateInteger,
  limit: validateInteger,
  search: validateString,
});

export const validateWithSchema = (
  schema: Joi.ObjectSchema<any>,
  validate: 'body' | 'query' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[validate], schemaOptions);

      if (error) throw error.message;

      next();
    } catch (error) {
      return res.sendError(error, 'validateWithSchema');
    }
  };
};

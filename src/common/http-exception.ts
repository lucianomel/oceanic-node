import {ValidationError} from 'express-validator'

export default class ExtendedError extends Error{
  statusCode: number;
  validationErrors: ValidationError[]|undefined;

  constructor(message: string,statusCode: number, validationErrors?: ValidationError[]) {
      super(message);
      this.message = message;
      this.statusCode = statusCode;
      this.validationErrors=validationErrors
    }
}
import { plainToClass } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';

import { Class } from '../common';

import { isValidArray, isValidObject } from './validate';

export async function toValidateClass(type: Class, data: any, options?: ValidatorOptions) {
  let errorMessage: any = null;

  if (type) {
    const errors = await validate(plainToClass(type, data), options);

    if (isValidArray(errors)) {
      const stack = [];

      stack.push(errors);

      while (stack.length > 0) {
        const node = stack.pop();

        for (const info of node) {
          if (isValidObject(info.constraints)) {
            errorMessage = Object.values(info.constraints)[0];

            break;
          } else {
            stack.push(info.children);
          }
        }
      }

      return errorMessage;
    }
  }

  return errorMessage;
}

import { validate } from 'class-validator';
import { toAssemble } from '@vodyani/transformer';

import { Class, ClassValidateOptions } from '../common';

import { isValidArray, isValidObject } from './validate';

export async function toValidateClass(
  type: Class,
  data: any,
  options?: ClassValidateOptions,
) {
  let errorMessage: any = null;
  const validateOptions = options?.validate;
  const transformOptions = options?.transform;

  if (type) {
    const errors = await validate(
      toAssemble(type, data, transformOptions),
      validateOptions,
    );

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

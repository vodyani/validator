import { ValidatorOptions } from 'class-validator';

import { Class, EachValidatedKey, ParamValidateOptions, RequiredKey, ValidatedKey } from '../common';

import { getReflectOwnMetadata, getReflectParamTypes } from './reflect';
import { toValidateClass } from './validate-class';
import { isValid } from './validate';

export function toValidateRequired(
  args: any[],
  target: any,
  property: string,
  Mode: Class<Error>,
) {
  const prams: ParamValidateOptions[] = getReflectOwnMetadata(RequiredKey, target, property);

  for (const { index, message } of prams) {
    if (args.length < index || !isValid(args[index])) {
      throw new Mode(message || 'missing required argument');
    }
  }
}

export async function toValidated(
  args: any[],
  target: any,
  property: string,
  Mode: Class<Error>,
  options: ValidatorOptions,
) {
  const types = getReflectParamTypes(target, property);
  const prams: ParamValidateOptions[] = getReflectOwnMetadata(ValidatedKey, target, property);

  for (const { index } of prams) {
    const item = args[index];
    const type = types[index];

    const errorMessage = await toValidateClass(type, item, options);

    if (errorMessage) {
      throw new Mode(errorMessage);
    }
  }
}

export async function toEachValidate(
  args: any[],
  target: any,
  property: string,
  Mode: Class<Error>,
  options: ValidatorOptions,
) {
  const prams: ParamValidateOptions[] = getReflectOwnMetadata(EachValidatedKey, target, property);

  for (const { index, type } of prams) {
    const data = args[index];

    if (isValid(data) && data.length && type) {
      for (const item of data) {
        const errorMessage = await toValidateClass(type, item, options);

        if (errorMessage) {
          throw new Mode(errorMessage);
        }
      }
    } else {
      throw new Mode('invalid argument');
    }
  }
}
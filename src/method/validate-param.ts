import { isMap } from 'lodash';

import { Class, EachValidatedKey, ValidateMetaData, RequiredKey, ValidatedKey, ClassValidateOptions } from '../common';

import { isValid } from './validate';
import { toValidateClass } from './validate-class';
import { getReflectOwnMetadata, getReflectParamTypes } from './reflect';

export function toValidateRequired(
  args: any[],
  target: any,
  property: string,
  Mode: Class<Error>,
) {
  const metaArgs: ValidateMetaData[] = getReflectOwnMetadata(RequiredKey, target, property);

  for (const { index, message } of metaArgs) {
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
  options: ClassValidateOptions,
) {
  const types = getReflectParamTypes(target, property);
  const metaArgs: ValidateMetaData[] = getReflectOwnMetadata(ValidatedKey, target, property);

  for (const { index } of metaArgs) {
    const item = args[index];
    const type = types[index];
    const errorMessage = await toValidateClass(type, item, options);

    if (errorMessage) throw new Mode(errorMessage);
  }
}

export async function toEachValidate(
  args: any[],
  target: any,
  property: string,
  Mode: Class<Error>,
  options: ClassValidateOptions,
) {
  const metaArgs: ValidateMetaData[] = getReflectOwnMetadata(EachValidatedKey, target, property);

  for (const { index, type } of metaArgs) {
    let data = args[index];

    if (isMap(data)) data = data.values();

    for (const item of data) {
      const errorMessage = await toValidateClass(type, item, options);
      if (errorMessage) throw new Mode(errorMessage);
    }
  }
}

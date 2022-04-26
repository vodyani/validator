import {
  toValidated,
  toEachValidate,
  toValidateRequired,
  getReflectOwnMetadata,
} from '../method';
import {
  Class,
  PromiseType,
  RequiredKey,
  ValidatedKey,
  EachValidatedKey,
  ValidateMetaData,
  ParamValidateOptions,
} from '../common';

export function Required(message?: string) {
  return function(target: any, property: any, index: number) {
    const data = getReflectOwnMetadata(RequiredKey, target, property);
    const metadata: ValidateMetaData = { index, message };

    data.push(metadata);
    Reflect.defineMetadata(RequiredKey, data, target, property);
  };
}

export function Validated(target: any, property: any, index: number) {
  const data = getReflectOwnMetadata(ValidatedKey, target, property);
  const metadata: ValidateMetaData = { index };

  data.push(metadata);
  Reflect.defineMetadata(ValidatedKey, data, target, property);
}

export function EachValidated(type: Class) {
  return function (target: any, property: any, index: number) {
    const data = getReflectOwnMetadata(EachValidatedKey, target, property);
    const metadata: ValidateMetaData = { index, type };

    data.push(metadata);
    Reflect.defineMetadata(EachValidatedKey, data, target, property);
  };
}

export function ParamValidate(options?: ParamValidateOptions) {
  return function(target: any, property: string, descriptor: TypedPropertyDescriptor<PromiseType>) {
    const method = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      toValidateRequired(args, target, property, options?.Mode || Error);

      await toValidated(args, target, property, options?.Mode || Error, options);

      await toEachValidate(args, target, property, options?.Mode || Error, options);

      const result = await method.apply(this, args);
      return result;
    };

    return descriptor;
  };
}

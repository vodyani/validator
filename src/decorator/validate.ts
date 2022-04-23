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
  ParamValidateOptions,
  ParamValidateDecoratorOptions,
} from '../common';

export function Required(message?: string) {
  return function(target: any, property: any, index: number) {
    const data = getReflectOwnMetadata(RequiredKey, target, property);
    const options: ParamValidateOptions = { index, message };

    data.push(options);
    Reflect.defineMetadata(RequiredKey, data, target, property);
  };
}

export function Validated(target: any, property: any, index: number) {
  const data = getReflectOwnMetadata(ValidatedKey, target, property);
  const options: ParamValidateOptions = { index };

  data.push(options);
  Reflect.defineMetadata(ValidatedKey, data, target, property);
}

export function EachValidated(type: Class) {
  return function (target: any, property: any, index: number) {
    const data = getReflectOwnMetadata(EachValidatedKey, target, property);
    const options: ParamValidateOptions = { index, type };

    data.push(options);
    Reflect.defineMetadata(EachValidatedKey, data, target, property);
  };
}

export function ParamValidate(options?: ParamValidateDecoratorOptions) {
  return function(target: any, property: string, descriptor: TypedPropertyDescriptor<PromiseType>) {
    const method = descriptor.value;
    const source = `${target.constructor.name}.${property}`;

    descriptor.value = async function(...args: any[]) {
      toValidateRequired(args, target, property, options?.Mode || Error);

      await toValidated(args, target, property, options?.Mode || Error, options?.validate);

      await toEachValidate(args, target, property, options?.Mode || Error, options?.validate);

      try {
        const result = await method.apply(this, args);
        return result;
      } catch (error) {
        error.message = `${error.message} from ${source}`;
        throw error;
      }
    };

    return descriptor;
  };
}

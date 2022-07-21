import { ValidatorOptions } from 'class-validator';
import { ClassTransformOptions } from '@vodyani/transformer';

export interface Class<T = any> extends Function {
  new (...args: any[]): T;
}

export interface ValidateMetaData {
  index: number;
  type?: Class;
  message?: string;
}

export interface ClassValidateOptions {
  validate?: ValidatorOptions;
  transform?: ClassTransformOptions;
}

export interface ArgumentValidateOptions extends ClassValidateOptions {
  Mode?: Class<Error>;
}

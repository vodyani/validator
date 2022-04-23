import { ValidatorOptions } from 'class-validator';

export interface Class<T = any> extends Function {
  new (...args: any[]): T;
}

export interface ParamValidateOptions {
  index: number;
  type?: Class;
  message?: string;
}

export interface ParamValidateDecoratorOptions {
  Mode?: Class<Error>;
  validate?: ValidatorOptions;
}

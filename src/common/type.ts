export type PromiseMethod<T = any> = (...args: any[]) => Promise<T>;
export type ValidateMethod = (data: any) => boolean;

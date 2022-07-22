import { Stream } from 'stream';

import { isURL, isIP } from 'class-validator';
import { isArray, isNil, isString, isNumber, isObject, isEmpty, isBuffer } from 'lodash';

/**
 * Checks if the data is non-empty.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValid(data: any): boolean {
  return !isNil(data);
}
/**
 * Checks if the data is non-empty string.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidString(data: string): boolean {
  return isValid(data) && isString(data) && !isEmpty(data);
}
/**
 * Checks if the data is non-empty number (Also it will not be NAN or plus or minus infinity).
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidNumber(data: number): boolean {
  return isValid(data) && isNumber(data) && Number.isSafeInteger(data);
}
/**
 * Checks if the data is non-empty array.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidArray(data: any[]): boolean {
  return isValid(data) && isArray(data) && !isEmpty(data);
}
/**
 * Checks if the data is non-empty object.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidObject(data: any): boolean {
  return isValid(data) && isObject(data) && !isEmpty(data);
}
/**
 * Checks if the data is stream.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidStream(data: Stream) {
  return isValid(data) && data instanceof Stream;
}
/**
 * Checks if the data is buffer.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidBuffer(data: Buffer) {
  return isValid(data) && isBuffer(data);
}
/**
 * Checks if the data is valid url.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidURL(data: string) {
  return isValidString(data) && isURL(data, { require_protocol: ['http', 'https', 'ftp'] });
}
/**
 * Checks if the data is valid ip.
 *
 * @param data The data to be check.
 * @returns boolean
 *
 * @publicApi
 */
export function isValidIP(data: string, version: '4' | '6' = '4') {
  return isValidString(data) && isIP(data, version);
}

import { Stream } from 'stream';

import { isURL, isIP } from 'class-validator';
import { isArray, isNil, isString, isNumber, isObject, isEmpty } from 'lodash';

export function isValid(it: any): boolean {
  return !isNil(it);
}

export function isValidString(it: string): boolean {
  return isValid(it) && isString(it) && !isEmpty(it);
}

export function isValidNumber(it: number): boolean {
  return isValid(it) && isNumber(it) && Number.isSafeInteger(it);
}

export function isValidStringNumber(it: string): boolean {
  return isValid(it) && isNumber(Number(it)) && Number.isSafeInteger(Number(it));
}

export function isValidArray(it: any[]): boolean {
  return isValid(it) && isArray(it) && !isEmpty(it);
}

export function isValidObject(it: any): boolean {
  return isValid(it) && isObject(it) && !isEmpty(it);
}

export function isValidStream(it: Stream) {
  return isValid(it) && it instanceof Stream;
}

export function isValidURL(it: string) {
  return isValidString(it) && isURL(it, { require_protocol: ['http', 'https', 'ftp'] });
}

export function isValidIP(it: string, version: '4' | '6' | 4 | 6 = '4') {
  return isValidString(it) && isIP(it, version);
}
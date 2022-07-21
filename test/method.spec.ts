/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Readable, Writable, Duplex, PassThrough, Transform } from 'stream';

import { PickType } from '@nestjs/swagger';
import { describe, it, expect } from '@jest/globals';
import { Expose, Type, TransformSet, TransformMap } from '@vodyani/transformer';

import { ValidateNested, IsNotEmpty, IsNumber, IsString, isValid, isValidArray, isValidIP, isValidNumber, isValidObject, isValidStream, isValidString, isValidStringNumber, isValidURL, toValidateClass } from '../src';

describe('test', () => {
  it('isValid', async () => {
    // eslint-disable-next-line no-undefined
    expect(isValid(undefined)).toBe(false);
    expect(isValid(null)).toBe(false);
    expect(isValid([])).toBe(true);
    expect(isValid({})).toBe(true);
    expect(isValid(0)).toBe(true);
    expect(isValid('')).toBe(true);
    expect(isValid(Number(''))).toBe(true);
  });

  it('isValidArray', async () => {
    // eslint-disable-next-line no-undefined
    expect(isValidArray(undefined as any)).toBe(false);
    expect(isValidArray(null as any)).toBe(false);
    expect(isValidArray([])).toBe(false);
    expect(isValidArray([{}])).toBe(true);
    expect(isValidArray([0])).toBe(true);
    expect(isValidArray([''])).toBe(true);
    expect(isValidArray([Number('')])).toBe(true);
  });

  it('isValidNumber', async () => {
    // eslint-disable-next-line no-undefined
    expect(isValidNumber(undefined as any)).toBe(false);
    expect(isValidNumber(null as any)).toBe(false);
    expect(isValidNumber(0)).toBe(true);
    expect(isValidNumber(('0' as unknown as number))).toBe(false);
    expect(isValidNumber(Infinity)).toBe(false);
    expect(isValidNumber(-Infinity)).toBe(false);
    expect(isValidNumber(Number('demo'))).toBe(false);
  });

  it('isValidStringNumber', async () => {
    // eslint-disable-next-line no-undefined
    expect(isValidStringNumber(undefined as any)).toBe(false);
    expect(isValidStringNumber(null as any)).toBe(false);
    expect(isValidStringNumber('null')).toBe(false);
    expect(isValidStringNumber('1')).toBe(true);
    expect(isValidStringNumber(0 as unknown as string)).toBe(true);
    expect(isValidStringNumber(Infinity as unknown as string)).toBe(false);
    expect(isValidStringNumber(-Infinity as unknown as string)).toBe(false);
    expect(isValidStringNumber(Number('demo') as unknown as string)).toBe(false);
  });

  it('isValidObject', async () => {
    // eslint-disable-next-line no-undefined
    expect(isValidObject(undefined)).toBe(false);
    expect(isValidObject(null)).toBe(false);
    expect(isValidObject({})).toBe(false);
    expect(isValidObject({ test: 1 })).toBe(true);
  });

  it('isValidString', async () => {
    // eslint-disable-next-line no-undefined
    expect(isValidString(undefined as any)).toBe(false);
    expect(isValidString(null as any)).toBe(false);
    expect(isValidString('')).toBe(false);
    expect(isValidString('demo')).toBe(true);
  });

  it('toValidateClass', async () => {
    // @ts-ignore
    class DICT { @IsNotEmpty({ message: 'test' }) public name: string; }

    // @ts-ignore
    class BASE { @ValidateNested() @Type(() => DICT) public dict: DICT[]; }

    const Base = new BASE();
    Base.dict = [{ name: null as any }];
    const message = await toValidateClass(BASE, Base);
    expect(message).toBe(null);
  });

  it('isValidURL', async () => {
    expect(isValidURL('https://google.com/')).toBe(true);
    expect(isValidURL('http://google.com/')).toBe(true);
    expect(isValidURL('http:/google.com/')).toBe(false);
    expect(isValidURL('http://127.0.0.1_3000')).toBe(false);
    expect(isValidURL('http://127.0.0.1:3000')).toBe(true);
    expect(isValidURL('127.0.0.1:3000')).toBe(false);
    expect(isValidURL('127.0.0.1')).toBe(false);
    expect(isValidURL('google.com')).toBe(false);
    expect(isValidURL('http://www.www.subdomain.baidu.com/index/subdir/index.html')).toBe(true);
  });

  it('isValidIP', async () => {
    expect(isValidIP('https://google.com/')).toBe(false);
    expect(isValidIP('http://google.com/')).toBe(false);
    expect(isValidIP('http:/google.com/')).toBe(false);
    expect(isValidIP('http://127.0.0.1_3000')).toBe(false);
    expect(isValidIP('http://127.0.0.1:3000')).toBe(false);
    expect(isValidIP('127.0.0.1:3000')).toBe(false);
    expect(isValidIP('127.0.0.1')).toBe(true);
    expect(isValidIP('2001:0000:3238:DFE1:63:0000:0000:FEFB', 6)).toBe(true);
    expect(isValidIP('google.com')).toBe(false);
    expect(isValidIP('http://www.www.subdomain.baidu.com/index/subdir/index.html')).toBe(false);
  });

  it('isValidStream', async () => {
    expect(isValidStream(null as any)).toBe(false);
    expect(isValidStream(new Readable())).toBe(true);
    expect(isValidStream(new Writable())).toBe(true);
    expect(isValidStream(new Duplex())).toBe(true);
    expect(isValidStream(new Transform())).toBe(true);
    expect(isValidStream(new PassThrough())).toBe(true);
  });

  it('toValidateClass', async () => {
    class DEMO {
      // @ts-ignore
      @Expose() @IsNotEmpty() @IsNumber({ allowNaN: false }) test: number;
    }

    class Test {
      // @ts-ignore
      @IsNotEmpty() @IsNumber({ allowNaN: false }) @Expose() age: number;
      // @ts-ignore
      @IsNotEmpty() @IsString() @Expose() name: string;
    }

    class PartOfDemo extends PickType(Test, ['name']) {}

    class Dict {
      // @ts-ignore
      @ValidateNested() @Expose() @Type(() => PartOfDemo) public item: PartOfDemo;
      // @ts-ignore
      @ValidateNested({ each: true }) @Expose() @Type(() => PartOfDemo) public array: PartOfDemo[];
      // @ts-ignore
      @ValidateNested({ each: true }) @Expose() @TransformSet(PartOfDemo) public set: Set<PartOfDemo>;
      // @ts-ignore
      @ValidateNested({ each: true }) @Expose() @TransformMap(PartOfDemo) public map: Map<string, PartOfDemo>;
    }

    expect(await toValidateClass(DEMO, { test: 1 })).toBe(null);
    expect(
      await toValidateClass(
        DEMO,
        { demo: 1 },
        {
          validate: { forbidUnknownValues: true },
        },
      ),
    ).toBe('test must be a number conforming to the specified constraints');

    expect(await toValidateClass(DEMO, { test: Number('test') })).toBe('test must be a number conforming to the specified constraints');
    expect(await toValidateClass(DEMO, { test: 'test' })).toBe('test must be a number conforming to the specified constraints');
    expect(await toValidateClass(PartOfDemo, { name: 'test' })).toBe(null);
    expect(await toValidateClass(PartOfDemo, { name: 1 })).toBe('name must be a string');
    expect(await toValidateClass(Dict, { item: { name: 1 }})).toBe('name must be a string');
  });
});

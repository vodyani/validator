/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect } from '@jest/globals';
import { UnauthorizedException } from '@nestjs/common';

import { IsNotEmpty, IsNumber, isValid, IsString, ParamValidate, ValidateIf, Validated, Required, EachValidated } from '../src';

class DemoData {
  // @ts-ignore
  @IsNumber({ allowNaN: false }, { message: 'number is not valid' }) @IsNotEmpty({ message: 'id is required' }) public id: number;
  // @ts-ignore
  @ValidateIf((item: DemoData) => isValid(item.name)) @IsString({ message: 'name is not valid' }) public name?: string;
}

class Demo {
  @ParamValidate()
  // @ts-ignore
  async getData(@Validated data: DemoData) { return data }
  // @ts-ignore
  @ParamValidate({ validate: { forbidUnknownValues: true }}) async getData2(@Validated data: DemoData) { return data }
  // @ts-ignore
  @ParamValidate({ Mode: UnauthorizedException }) async getData3(@Validated data: DemoData, @Required('test') name?: string) { return { name, data } }
  // @ts-ignore
  @ParamValidate() async getData4(@EachValidated(DemoData) list: DemoData[]) { return list }
  // @ts-ignore
  @ParamValidate({ Mode: UnauthorizedException }) async getData5(@Required() list: DemoData[]) { return list }
  // @ts-ignore
  @ParamValidate({ Mode: UnauthorizedException }) async getData6(@EachValidated(DemoData) list: DemoData[]) { return list }
  // @ts-ignore
  @ParamValidate({ Mode: UnauthorizedException }) async getData7(@EachValidated(DemoData) list: DemoData[]) { throw new Error('test') }
}

describe('decorator.validate', () => {
  it('ParamValidate', async () => {
    const demo = new Demo();

    const data = await demo.getData({ id: 1, name: 'test' });
    expect(data.id).toEqual(1);

    const data2 = await demo.getData({ id: 2 });
    expect(data2.id).toEqual(2);

    try {
      await demo.getData({ id: null });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData({ id: Number('test') });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData({ id: 1, name: 2 as any });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData2({ id: 1, name: 2 as any });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData3({ id: 2 });
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
    }

    try {
      await demo.getData4([{ id: '1' as any }]);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData5(null);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData6(null);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }

    try {
      await demo.getData7([{ id: 1, name: 'test' }]);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

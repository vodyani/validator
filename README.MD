# Vodyani validator

*🔍 "validator" offers simple-to-use decorators and validation techniques.*

[![Npm](https://img.shields.io/npm/v/@vodyani/validator/latest.svg)](https://www.npmjs.com/package/@vodyani/validator)
[![Npm](https://img.shields.io/npm/v/@vodyani/validator/beta.svg)](https://www.npmjs.com/package/@vodyani/validator)
[![Npm](https://img.shields.io/npm/dm/@vodyani/validator)](https://www.npmjs.com/package/@vodyani/validator)
[![License](https://img.shields.io/github/license/vodyani/validator)](LICENSE)
<br>
[![codecov](https://codecov.io/gh/vodyani/validator/branch/master/graph/badge.svg?token=O0BNXIWW1M)](https://codecov.io/gh/vodyani/validator)
![Workflow](https://github.com/vodyani/validator/actions/workflows/release.yml/badge.svg)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Installation

```sh
npm install @vodyani/validator
```

## Usage

- [Class Validator](#class-validator)
- [Method Validator](#method-validator)

## Class Validator

The core functionality of `@vodyani/validator` comes from [class-validator](https://github.com/typestack/class-validator).

Use decorators to complete the verification of internal class properties.

> Before we begin, let's look at a basic example.

- 👉🏻 [usage](https://github.com/typestack/class-validator#usage)
- 👉🏻 [decorators](https://github.com/typestack/class-validator#validation-decorators)

> Next, let's see what awesome features `@vodyani/validator` offers.

|Features|Type|Description|
|:-:|:-:|:-:|
|[toValidateClass](#toassemble)|method||
|[ArgumentValidator](#assemble)|decorator||
|[Required](#transformvalue)|decorator||
|[Validated](#transformset)|decorator||
|[EachValidated](#transformmap)|decorator||
|[CustomValidated](#transformmap)|decorator||

### toValidateClass

Validate the class structure against the incoming classes and data.

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`type`|`Class`|*The classes that need to be validated.*|
|`data`|`object`|*The data that needs to be validated.*|
|`options`|`ClassValidateOptions`|*The rules options for data conversion and validation.*|

**ClassValidateOptions**

**see:**

- [ValidatorOptions](https://github.com/typestack/class-validator#passing-options)
- [ClassTransformOptions](https://github.com/typestack/class-transformer#advanced-usage)

```ts
export interface ClassValidateOptions {
  /**
   * The class-validator options.
   *
   * It's highly advised to set forbidUnknownValues: true as it will prevent unknown objects from passing validation.
   */
  validate?: ValidatorOptions;
  /**
   * The class-transformer options. (`excludeExtraneousValues` is enabled by default)
   */
  transform?: ClassTransformOptions;
}
```

**Return**

string (error message)

**Example**

**Tips:**

- The class-transformer options, `excludeExtraneousValues` is enabled by default !
- About the optional judgment in the example [`@ValidateIf`](https://github.com/typestack/class-validator#conditional-validation).

```ts
import { Expose } from '@vodyani/transformer';
import { toValidateClass, isValid, IsNumber, IsString, IsNotEmpty, ValidateIf } from '@vodyani/validator';

class User {
  @Expose()
  @IsNumber({ allowNaN: false }, { message: 'id is not valid !' })
  public id: number;

  @Expose()
  @IsString({ message: 'name is not valid !' })
  @ValidateIf((user: User) => isValid(user.name))
  public name?: string;
}

toValidateClass(User, { id: '1' }) // Error: id is not valid !
toValidateClass(User, { id: 1, name: 1 }) // Error: name is not valid !
```

### ArgumentValidator

Method validator, needs to be used in combination with other parameter decorators.

**Tips:**

Can only be bound to asynchronous methods !

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`options`|`ArgumentValidateOptions`|*The argument validator options.*|

**ArgumentValidateOptions**

**see:**

- [ValidatorOptions](https://github.com/typestack/class-validator#passing-options)

```ts
/**
 * The class-validator options.
 *
 * It's highly advised to set forbidUnknownValues: true as it will prevent unknown objects from passing validation.
 */
export interface ArgumentValidateOptions extends ClassValidateOptions {
  /** The error mode */
  Mode?: Class<Error>;
}
```

### Required

Specify a method parameter that must be passed in, or throw an exception.

**Tips:**

- This is a parameter Decorator.
- Must be used in conjunction with the method decorator: `ArgumentValidator` !

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`message`|`string`|*The error message. (default: `missing required argument !`)*|

**Example**

```ts
import { ArgumentValidator, Required } from '@vodyani/validator';

class UserRecord {
  @ArgumentValidator()
  async getInfo(@Required() id: number) {
    return {
      id,
      name: 'demo',
    };
  }
}

const record = new UserRecord();

await record.getInfo(null); // Error: missing required argument !
```

### Validated

Specify a method parameter for the method that needs to be executed in the validator.

**Tips:**

- This is a parameter Decorator.
- Must be used in conjunction with the method decorator: `ArgumentValidator` !

**Example**

```ts
import { Expose } from '@vodyani/transformer';
import { ArgumentValidator, IsNumber, Validated } from '@vodyani/validator';

class User {
  @Expose()
  @IsNumber({ allowNaN: false }, { message: 'id is not valid !' })
  public id: number;
}

class UserRecord {
  @ArgumentValidator()
  async saveInfo(@Validated() user: User) {
    return user;
  }
}

const record = new UserRecord();

await record.saveInfo({ id: null }); // Error: id is not valid !
```

### EachValidated

Specify a method parameter that needs to be executed in the validator, and this parameter needs to be looped through.

**Tips:**

- This is a parameter Decorator.
- Must be used in conjunction with the method decorator: `ArgumentValidator` !

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`type`|`Class`|*The classes that need to be validated.*|

**Example**

```ts
import { Expose } from '@vodyani/transformer';
import { ArgumentValidator, EachValidated, IsNumber } from '@vodyani/validator';

class User {
  @Expose()
  @IsNumber({ allowNaN: false }, { message: 'id is not valid !' })
  public id: number;
}

class UserRecord {
  @ArgumentValidator()
  async saveAll(@EachValidated() users: User[]) {
    return users;
  }
}

const record = new UserRecord();

await record.saveAll([{ id: null }]); // Error: id is not valid !
```

### CustomValidated

Validate parameters using custom validators.

**Tips:**

- This is a parameter Decorator.
- Must be used in conjunction with the method decorator: `ArgumentValidator` !

**Params**

|param|type|description|
|:-:|:-:|:-:|
|`validator`|`(data: any) => boolean`|*The validation function.*|
|`message`|`string`|*The error message.*|

**Example**

```ts
import { ArgumentValidator, CustomValidated, isValid } from '@vodyani/validator';

class UserRecord {
  @ArgumentValidator()
  async getInfo(@CustomValidated(isValid, 'error')) id: number) {
    return {
      id,
      name: 'demo',
    };
  }
}

const record = new UserRecord();

await record.getInfo(null); // Error: error
```

## Method Validator

|param|description|
|:-:|:-:|
|`isValid`|Checks if the data is non-empty.|
|`isValidIP`|Checks if the data is valid ip.|
|`isValidURL`|Checks if the data is valid url.|
|`isValidArray`|Checks if the data is non-empty array.|
|`isValidString`|Checks if the data is non-empty string.|
|`isValidNumber`|Checks if the data is non-empty number (Also it will not be NAN or plus or minus infinity).|
|`isValidObject`|Checks if the data is non-empty object.|
|`isValidStream`|Checks if the data is stream.|
|`isValidBuffer`|Checks if the data is buffer.|

## License

Vodyani validator is [MIT licensed](LICENSE).

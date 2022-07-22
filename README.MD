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
- About the optional judgment in the example [conditional validation](https://github.com/typestack/class-validator#conditional-validation).

```ts
import { Expose } from '@vodyani/transformer';
import { toValidateClass, isValid, IsNumber, IsString, IsNotEmpty, ValidateIf } from '@vodyani/validator';

class User {
  @Expose()
  @IsNumber({ allowNaN: false }, { message: 'id is not valid !' })
  public id: number;

  @Expose()
  @ValidateIf((user: User) => isValid(user.name))
  @IsString({ message: 'name is not valid !' })
  public name?: string;
}

toValidateClass(User, { id: '1' }) // Error: id is not valid !
toValidateClass(User, { id: 1, name: 1 }) // Error: name is not valid !
```

### ArgumentValidator
### Required
### Validated
### EachValidated
### CustomValidated

## Method Validator

## License

Vodyani validator is [MIT licensed](LICENSE).

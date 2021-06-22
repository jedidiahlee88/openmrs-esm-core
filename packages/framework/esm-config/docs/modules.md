[@openmrs/esm-config](API.md) / Exports

# @openmrs/esm-config

## Table of contents

### Enumerations

- [Type](enums/type.md)

### Interfaces

- [Config](interfaces/config.md)
- [ConfigObject](interfaces/configobject.md)
- [ConfigSchema](interfaces/configschema.md)
- [ConfigStore](interfaces/configstore.md)
- [ExtensionSlotConfig](interfaces/extensionslotconfig.md)
- [ExtensionSlotConfigObject](interfaces/extensionslotconfigobject.md)
- [ExtensionSlotConfigsStore](interfaces/extensionslotconfigsstore.md)
- [ExtensionSlotConfigureValueObject](interfaces/extensionslotconfigurevalueobject.md)
- [ImplementerToolsConfigStore](interfaces/implementertoolsconfigstore.md)
- [NavigateOptions](interfaces/navigateoptions.md)

### Type aliases

- [ConfigValue](modules.md#configvalue)
- [ProvidedConfig](modules.md#providedconfig)
- [Validator](modules.md#validator)
- [ValidatorFunction](modules.md#validatorfunction)

### Variables

- [implementerToolsConfigStore](modules.md#implementertoolsconfigstore)
- [temporaryConfigStore](modules.md#temporaryconfigstore)
- [validators](modules.md#validators)

### Navigation Functions

- [interpolateString](modules.md#interpolatestring)
- [isUrl](modules.md#isurl)
- [isUrlWithTemplateParameters](modules.md#isurlwithtemplateparameters)
- [navigate](modules.md#navigate)

### Other Functions

- [defineConfigSchema](modules.md#defineconfigschema)
- [getConfig](modules.md#getconfig)
- [getConfigStore](modules.md#getconfigstore)
- [getExtensionConfigStore](modules.md#getextensionconfigstore)
- [getExtensionSlotsConfigStore](modules.md#getextensionslotsconfigstore)
- [inRange](modules.md#inrange)
- [processConfig](modules.md#processconfig)
- [provide](modules.md#provide)
- [validator](modules.md#validator)

## Type aliases

### ConfigValue

Ƭ **ConfigValue**: `string` \| `number` \| `boolean` \| `void` \| `any`[] \| `object`

#### Defined in

[packages/framework/esm-config/src/types.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L30)

___

### ProvidedConfig

Ƭ **ProvidedConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config` | [Config](interfaces/config.md) |
| `source` | `string` |

#### Defined in

[packages/framework/esm-config/src/types.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L55)

___

### Validator

Ƭ **Validator**: (`value`: `any`) => `void` \| `string`

#### Type declaration

▸ (`value`): `void` \| `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

##### Returns

`void` \| `string`

#### Defined in

[packages/framework/esm-config/src/types.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L62)

___

### ValidatorFunction

Ƭ **ValidatorFunction**: (`value`: `any`) => `boolean`

#### Type declaration

▸ (`value`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

##### Returns

`boolean`

#### Defined in

[packages/framework/esm-config/src/types.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/types.ts#L60)

## Variables

### implementerToolsConfigStore

• `Const` **implementerToolsConfigStore**: `Store`<[ImplementerToolsConfigStore](interfaces/implementertoolsconfigstore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:188](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L188)

___

### temporaryConfigStore

• `Const` **temporaryConfigStore**: `Store`<TemporaryConfigStore\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L75)

___

### validators

• `Const` **validators**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inRange` | (`min`: `number`, `max`: `number`) => [Validator](modules.md#validator) |
| `isUrl` | [Validator](modules.md#validator) |
| `isUrlWithTemplateParameters` | (`allowedTemplateParameters`: `string`[]) => [Validator](modules.md#validator) |

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L57)

## Navigation Functions

### interpolateString

▸ **interpolateString**(`template`, `params`): `string`

Interpolates values of `params` into the `template` string.

Useful for additional template parameters in URLs.

Example usage:
```js
navigate({
 to: interpolateString(
   config.links.patientChart,
   { patientUuid: patient.uuid }
 )
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `template` | `string` | With optional params wrapped in `${ }` |
| `params` | `object` | Values to interpolate into the string template |

#### Returns

`string`

#### Defined in

[packages/framework/esm-config/src/navigation/interpolate-string.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/navigation/interpolate-string.ts#L38)

___

### isUrl

▸ `Const` **isUrl**(`value`): `string` \| `void`

Verifies that a string contains only the default URL template parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`string` \| `void`

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:55](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L55)

___

### isUrlWithTemplateParameters

▸ `Const` **isUrlWithTemplateParameters**(`allowedTemplateParameters`): [Validator](modules.md#validator)

Verifies that a string contains only the default URL template
parameters, plus any specified in `allowedTemplateParameters`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowedTemplateParameters` | `string`[] | To be added to `openmrsBase` and `openmrsSpaBase` |

#### Returns

[Validator](modules.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L23)

___

### navigate

▸ **navigate**(`__namedParameters`): `void`

Calls `location.assign` for non-SPA paths and [navigateToUrl](https://single-spa.js.org/docs/api/#navigatetourl) for SPA paths

Example usage:
```js
const config = getConfig();
const submitHandler = () => {
  navigate({ to: config.links.submitSuccess });
};
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [NavigateOptions](interfaces/navigateoptions.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/navigation/navigate.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/navigation/navigate.ts#L29)

___

## Other Functions

### defineConfigSchema

▸ **defineConfigSchema**(`moduleName`, `schema`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |
| `schema` | [ConfigSchema](interfaces/configschema.md) |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:203](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L203)

___

### getConfig

▸ **getConfig**(`moduleName`): `Promise`<[Config](interfaces/config.md)\>

A promise-based way to access the config as soon as it is fully loaded
from the import-map. If it is already loaded, resolves the config in its
present state.

In general you should use the Unistore-based API provided by
`getConfigStore`, which allows creating a subscription so that you always
have the latest config. If using React, just use `useConfig`.

This is a useful function if you need to get the config in the course
of the execution of a function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | `string` | The name of the module for which to look up the config |

#### Returns

`Promise`<[Config](interfaces/config.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:232](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L232)

___

### getConfigStore

▸ **getConfigStore**(`moduleName`): `Store`<[ConfigStore](interfaces/configstore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`Store`<[ConfigStore](interfaces/configstore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:142](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L142)

___

### getExtensionConfigStore

▸ **getExtensionConfigStore**(`extensionSlotModuleName`, `attachedExtensionSlotName`, `extensionId`): `Store`<[ConfigStore](interfaces/configstore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `extensionSlotModuleName` | `string` |
| `attachedExtensionSlotName` | `string` |
| `extensionId` | `string` |

#### Returns

`Store`<[ConfigStore](interfaces/configstore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:172](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L172)

___

### getExtensionSlotsConfigStore

▸ **getExtensionSlotsConfigStore**(`moduleName`): `Store`<[ExtensionSlotConfigsStore](interfaces/extensionslotconfigsstore.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `moduleName` | `string` |

#### Returns

`Store`<[ExtensionSlotConfigsStore](interfaces/extensionslotconfigsstore.md)\>

#### Defined in

[packages/framework/esm-config/src/module-config/state.ts:163](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/state.ts#L163)

___

### inRange

▸ `Const` **inRange**(`min`, `max`): [Validator](modules.md#validator)

Verifies that the value is between the provided minimum and maximum

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `min` | `number` | Minimum acceptable value |
| `max` | `number` | Maximum acceptable value |

#### Returns

[Validator](modules.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validators.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validators.ts#L9)

___

### processConfig

▸ **processConfig**(`schema`, `providedConfig`, `keyPathContext`): [Config](interfaces/config.md)

Validate and interpolate defaults for `providedConfig` according to `schema`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `schema` | [ConfigSchema](interfaces/configschema.md) | a configuration schema |
| `providedConfig` | [ConfigObject](interfaces/configobject.md) | an object of config values (without the top-level module name) |
| `keyPathContext` | `string` | a dot-deparated string which helps the user figure out where     the provided config came from |

#### Returns

[Config](interfaces/config.md)

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:254](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L254)

___

### provide

▸ **provide**(`config`, `sourceName?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `config` | [Config](interfaces/config.md) | `undefined` |
| `sourceName` | `string` | "provided" |

#### Returns

`void`

#### Defined in

[packages/framework/esm-config/src/module-config/module-config.ts:211](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/module-config/module-config.ts#L211)

___

### validator

▸ **validator**(`validationFunction`, `message`): [Validator](modules.md#validator)

#### Parameters

| Name | Type |
| :------ | :------ |
| `validationFunction` | [ValidatorFunction](modules.md#validatorfunction) |
| `message` | `string` |

#### Returns

[Validator](modules.md#validator)

#### Defined in

[packages/framework/esm-config/src/validators/validator.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-config/src/validators/validator.ts#L3)

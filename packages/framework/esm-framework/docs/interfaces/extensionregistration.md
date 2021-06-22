[@openmrs/esm-framework](../API.md) / [Exports](../modules.md) / ExtensionRegistration

# Interface: ExtensionRegistration

## Hierarchy

- **ExtensionRegistration**

  ↳ [ExtensionInfo](extensioninfo.md)

## Table of contents

### Properties

- [meta](extensionregistration.md#meta)
- [moduleName](extensionregistration.md#modulename)
- [name](extensionregistration.md#name)
- [offline](extensionregistration.md#offline)
- [online](extensionregistration.md#online)
- [order](extensionregistration.md#order)

### Methods

- [load](extensionregistration.md#load)

## Properties

### meta

• **meta**: [ExtensionMeta](extensionmeta.md)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L15)

___

### moduleName

• **moduleName**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L14)

___

### name

• **name**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L12)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L18)

___

### online

• `Optional` **online**: `boolean` \| `object`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L17)

___

### order

• `Optional` **order**: `number`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L16)

## Methods

### load

▸ **load**(): `Promise`<any\>

#### Returns

`Promise`<any\>

#### Defined in

[packages/framework/esm-extensions/src/store.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L13)

[@openmrs/esm-framework](../API.md) / ComponentDefinition

# Interface: ComponentDefinition

## Hierarchy

- **`ComponentDefinition`**

  ↳ [`ExtensionDefinition`](ExtensionDefinition.md)

  ↳ [`PageDefinition`](PageDefinition.md)

## Table of contents

### Properties

- [appName](ComponentDefinition.md#appname)
- [offline](ComponentDefinition.md#offline)
- [online](ComponentDefinition.md#online)
- [privilege](ComponentDefinition.md#privilege)
- [resources](ComponentDefinition.md#resources)

### Methods

- [load](ComponentDefinition.md#load)

## Properties

### appName

• **appName**: `string`

The module/app that defines the component

#### Defined in

[packages/framework/esm-globals/src/types.ts:109](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L109)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

Defines the offline support / properties of the component.

#### Defined in

[packages/framework/esm-globals/src/types.ts:121](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L121)

___

### online

• `Optional` **online**: `boolean` \| `object`

Defines the online support / properties of the component.

#### Defined in

[packages/framework/esm-globals/src/types.ts:117](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L117)

___

### privilege

• `Optional` **privilege**: `string` \| `string`[]

Defines the access privilege(s) required for this component, if any.
If more than one privilege is provided, the user must have all specified permissions.

#### Defined in

[packages/framework/esm-globals/src/types.ts:126](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L126)

___

### resources

• `Optional` **resources**: `Record`<`string`, [`ResourceLoader`](ResourceLoader.md)<`any`\>\>

Defines resources that are loaded when the component should mount.

#### Defined in

[packages/framework/esm-globals/src/types.ts:130](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L130)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

Defines a function to use for actually loading the component's lifecycle.

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/framework/esm-globals/src/types.ts:113](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L113)

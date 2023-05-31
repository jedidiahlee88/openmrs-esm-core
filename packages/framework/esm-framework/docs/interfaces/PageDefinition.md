[@openmrs/esm-framework](../API.md) / PageDefinition

# Interface: PageDefinition

## Hierarchy

- [`ComponentDefinition`](ComponentDefinition.md)

  ↳ **`PageDefinition`**

## Table of contents

### Properties

- [appName](PageDefinition.md#appname)
- [offline](PageDefinition.md#offline)
- [online](PageDefinition.md#online)
- [order](PageDefinition.md#order)
- [privilege](PageDefinition.md#privilege)
- [resources](PageDefinition.md#resources)
- [route](PageDefinition.md#route)

### Methods

- [load](PageDefinition.md#load)

## Properties

### appName

• **appName**: `string`

The module/app that defines the component

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[appName](ComponentDefinition.md#appname)

#### Defined in

[packages/framework/esm-globals/src/types.ts:109](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L109)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

Defines the offline support / properties of the component.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[offline](ComponentDefinition.md#offline)

#### Defined in

[packages/framework/esm-globals/src/types.ts:121](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L121)

___

### online

• `Optional` **online**: `boolean` \| `object`

Defines the online support / properties of the component.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[online](ComponentDefinition.md#online)

#### Defined in

[packages/framework/esm-globals/src/types.ts:117](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L117)

___

### order

• **order**: `number`

The order in which to load the page. This determines DOM order.

#### Defined in

[packages/framework/esm-globals/src/types.ts:156](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L156)

___

### privilege

• `Optional` **privilege**: `string` \| `string`[]

Defines the access privilege(s) required for this component, if any.
If more than one privilege is provided, the user must have all specified permissions.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[privilege](ComponentDefinition.md#privilege)

#### Defined in

[packages/framework/esm-globals/src/types.ts:126](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L126)

___

### resources

• `Optional` **resources**: `Record`<`string`, [`ResourceLoader`](ResourceLoader.md)<`any`\>\>

Defines resources that are loaded when the component should mount.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[resources](ComponentDefinition.md#resources)

#### Defined in

[packages/framework/esm-globals/src/types.ts:130](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L130)

___

### route

• **route**: `string`

The route of the page.

#### Defined in

[packages/framework/esm-globals/src/types.ts:152](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L152)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

Defines a function to use for actually loading the component's lifecycle.

#### Returns

`Promise`<`any`\>

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[load](ComponentDefinition.md#load)

#### Defined in

[packages/framework/esm-globals/src/types.ts:113](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L113)

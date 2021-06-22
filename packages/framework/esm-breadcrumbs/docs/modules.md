[@openmrs/esm-breadcrumbs](API.md) / Exports

# @openmrs/esm-breadcrumbs

## Table of contents

### Interfaces

- [BreadcrumbRegistration](interfaces/breadcrumbregistration.md)
- [BreadcrumbSettings](interfaces/breadcrumbsettings.md)

### Breadcrumb Functions

- [filterBreadcrumbs](modules.md#filterbreadcrumbs)
- [getBreadcrumbs](modules.md#getbreadcrumbs)
- [getBreadcrumbsFor](modules.md#getbreadcrumbsfor)
- [registerBreadcrumb](modules.md#registerbreadcrumb)
- [registerBreadcrumbs](modules.md#registerbreadcrumbs)

## Breadcrumb Functions

### filterBreadcrumbs

▸ **filterBreadcrumbs**(`list`, `path`): [BreadcrumbRegistration](interfaces/breadcrumbregistration.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `list` | [BreadcrumbRegistration](interfaces/breadcrumbregistration.md)[] |
| `path` | `string` |

#### Returns

[BreadcrumbRegistration](interfaces/breadcrumbregistration.md)[]

#### Defined in

[filter.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/filter.ts#L49)

___

### getBreadcrumbs

▸ **getBreadcrumbs**(): [BreadcrumbRegistration](interfaces/breadcrumbregistration.md)[]

#### Returns

[BreadcrumbRegistration](interfaces/breadcrumbregistration.md)[]

#### Defined in

[db.ts:50](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/db.ts#L50)

___

### getBreadcrumbsFor

▸ **getBreadcrumbsFor**(`path`): [BreadcrumbRegistration](interfaces/breadcrumbregistration.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

[BreadcrumbRegistration](interfaces/breadcrumbregistration.md)[]

#### Defined in

[filter.ts:78](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/filter.ts#L78)

___

### registerBreadcrumb

▸ **registerBreadcrumb**(`breadcrumb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `breadcrumb` | [BreadcrumbSettings](interfaces/breadcrumbsettings.md) |

#### Returns

`void`

#### Defined in

[db.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/db.ts#L26)

___

### registerBreadcrumbs

▸ **registerBreadcrumbs**(`breadcrumbs`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `breadcrumbs` | [BreadcrumbSettings](interfaces/breadcrumbsettings.md)[] |

#### Returns

`void`

#### Defined in

[db.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-breadcrumbs/src/db.ts#L35)

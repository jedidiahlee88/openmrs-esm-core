[@openmrs/esm-api](../API.md) / FetchResponse

# Interface: FetchResponse<T\>

## Type parameters

Name | Default |
:------ | :------ |
`T` | *any* |

## Hierarchy

* *Response*

  ↳ **FetchResponse**

  ↳↳ [*LoggedInUserFetchResponse*](loggedinuserfetchresponse.md)

## Table of contents

### Properties

- [body](fetchresponse.md#body)
- [bodyUsed](fetchresponse.md#bodyused)
- [data](fetchresponse.md#data)
- [headers](fetchresponse.md#headers)
- [ok](fetchresponse.md#ok)
- [redirected](fetchresponse.md#redirected)
- [status](fetchresponse.md#status)
- [statusText](fetchresponse.md#statustext)
- [trailer](fetchresponse.md#trailer)
- [type](fetchresponse.md#type)
- [url](fetchresponse.md#url)

### Methods

- [arrayBuffer](fetchresponse.md#arraybuffer)
- [blob](fetchresponse.md#blob)
- [clone](fetchresponse.md#clone)
- [formData](fetchresponse.md#formdata)
- [json](fetchresponse.md#json)
- [text](fetchresponse.md#text)

## Properties

### body

• `Readonly` **body**: *null* \| *ReadableStream*<Uint8Array\>

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2623

___

### bodyUsed

• `Readonly` **bodyUsed**: *boolean*

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2624

___

### data

• **data**: T

Defined in: [packages/esm-api/src/types/index.ts:2](https://github.com/nk183/openmrs-esm-core/blob/master/packages/esm-api/src/types/index.ts#L2)

___

### headers

• `Readonly` **headers**: Headers

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12717

___

### ok

• `Readonly` **ok**: *boolean*

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12718

___

### redirected

• `Readonly` **redirected**: *boolean*

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12719

___

### status

• `Readonly` **status**: *number*

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12720

___

### statusText

• `Readonly` **statusText**: *string*

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12721

___

### trailer

• `Readonly` **trailer**: *Promise*<Headers\>

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12722

___

### type

• `Readonly` **type**: ResponseType

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12723

___

### url

• `Readonly` **url**: *string*

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12724

## Methods

### arrayBuffer

▸ **arrayBuffer**(): *Promise*<ArrayBuffer\>

**Returns:** *Promise*<ArrayBuffer\>

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2625

___

### blob

▸ **blob**(): *Promise*<Blob\>

**Returns:** *Promise*<Blob\>

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2626

___

### clone

▸ **clone**(): Response

**Returns:** Response

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:12725

___

### formData

▸ **formData**(): *Promise*<FormData\>

**Returns:** *Promise*<FormData\>

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2627

___

### json

▸ **json**(): *Promise*<any\>

**Returns:** *Promise*<any\>

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2628

___

### text

▸ **text**(): *Promise*<string\>

**Returns:** *Promise*<string\>

Inherited from: void

Defined in: node_modules/typescript/lib/lib.dom.d.ts:2629

[@openmrs/esm-framework](../API.md) / OfflinePatientArgs

# Interface: OfflinePatientArgs

## Table of contents

### Offline Properties

- [patientUuid](OfflinePatientArgs.md#patientuuid)
- [signal](OfflinePatientArgs.md#signal)

## Offline Properties

### patientUuid

• **patientUuid**: `string`

The UUID of the patient that should be made available offline.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:71](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L71)

___

### signal

• **signal**: `AbortSignal`

An {@link AbortSignal} which notifies about the cancellation of the operation.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:75](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L75)

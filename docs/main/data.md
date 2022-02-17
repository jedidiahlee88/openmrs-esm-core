# Retrieving and Posting Data

Frontend modules interact with the OpenMRS server via the APIs exposed
by its modules. In general, most of the endpoints we use are provided
by the [FHIR Module](https://wiki.openmrs.org/display/projects/OpenMRS+HL7+FHIR+Solutions).
Most of the rest are provided by the
[REST Module](https://wiki.openmrs.org/display/docs/REST+Module), which is
documented [here](https://rest.openmrs.org/).

Endpoints from the FHIR Module should always be preferred, when they are
available. FHIR is an interoperability standard which OpenMRS supports.

Some data is available using higher-level functions or custom React Hooks provided
by `@openmrs/esm-framework`.  These should be used when available.

All of this functionality (React hooks excepted) is provided by the
[`@openmrs/esm-api`](https://github.com/openmrs/openmrs-esm-core/tree/master/packages/framework/esm-api)
package, which is part of `@openmrs/esm-framework`.
The React hooks are in
[`@openmrs/esm-react-utils`](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils),
which is also part of `@openmrs/esm-framework`. See the
[API Docs](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-framework/docs/API.md).

## FHIR

To use the FHIR API, use the [fhir.js](https://github.com/FHIR/fhir.js#fhirjs)
client object provided by `@openmrs/esm-framework`:

```typescript
import { fhir } from '@openmrs/esm-framework';

fhir.read<fhir.Patient>({ type: 'Patient', patient: patientUuid })
```

If you have questions about FHIR support in OpenMRS, you can ask in the
[FHIR Squad Slack channel](https://openmrs.slack.com/archives/CKLPH66BB).

## Other OpenMRS server APIs

Some administrative endpoints will likely never have a proper representation in FHIR (e.g., endpoints for managing encounter types). When no suitable FHIR endpoint is available, you will want to use a different OpenMRS server API. The [REST Web Services API](https://rest.openmrs.org/) is used widely across many of our frontend modules.

We recommend using [SWR](https://swr.vercel.app/docs/data-fetching) based hooks and the [`openmrsFetch`](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-framework/docs/API.md#openmrsfetch) fetcher function to retrieve data from the server. SWR offers a host of features that help us deliver an improved user experience.

Here's an example of a custom SWR hook that retrieves visits data.

```typescript
import useSWR from 'swr';
import { openmrsFetch, Visit } from '@openmrs/esm-framework';

interface VisitData {
  results: Array<Visit>;
}

/* Custom data fetching hook */ 
export function useVisits() {
  const url = `/ws/rest/v1/visit?includeInactive=false`;

  const { data, error } = useSWR<{ data: VisitData }, Error>(url, openmrsFetch);

  return {
    visits: data,
    isLoading: !data && !error,
    isError: error,
  };
}
```

We can leverage this `useVisits` hook in our `visits` component as follows:

```typescript
const Visits = () => {
  const { visits, isError, isLoading } = useVisits();

  if (isLoading) {
    return <DataTableSkeleton role="progressbar" />
  }
  if (isError) {
    // render error state
  }
  if (visits?.length) {
    // render visits
  }
  return (
    // render empty state
  )
}

export default Visits;
```

## Posting data to the server

Here's an example that demonstrates posting session data to the server.

```typescript
import { openmrsFetch } from '@openmrs/esm-framework'

const abortController = new AbortController();
abortController.abort();
openmrsFetch('/ws/rest/v1/session', {
  method: 'POST',
  body: {
    username: 'hi',
    password: 'there',
  },
  signal: abortController.signal
});
```

It is best practice for POST requests to have an
[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).
You should ensure that `AbortController.abort()` is called when the component is unmounted
if the request is not yet completed.

In a React Component this is usually accomplished by making the request
in a [`useEffect` hook](https://reactjs.org/docs/hooks-effect.html):

```typescript
useEffect(() => {
  const abortController = new AbortController();
  someFetchFunction(abortController)
    .then(setResult)
    .catch(setError);
  return () => abortController.abort();
}, []);
```

## API Objects

Some API objects are made available via React hooks (or via framework-agnostic subscriptions).
The hooks are in
`@openmrs/esm-react-utils`,
and the subscription-yielding equivalents are in
[`@openmrs/esm-api`](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-framework/docs/API.md#api-functions).
See for example [`useVisitTypes`](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-framework/docs/API.md#usevisittypes)
and the corresponding [`getVisitTypes`](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-framework/docs/API.md#getvisittypes).

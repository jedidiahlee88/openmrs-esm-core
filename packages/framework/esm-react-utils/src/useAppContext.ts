import { useEffect, useState } from 'react';
import { subscribeToContext } from '@openmrs/esm-context';
import { shallowEqual } from '@openmrs/esm-utils';

function useAppContext<T = unknown>(namespace: string): T | undefined;

/**
 * This hook is used to access a namespace within the overall AppContext, so that a component can
 * use any shared contextual values. A selector may be provided to further restrict the properties
 * returned from the namespace.
 *
 * @example
 * ```ts
 * // load a full namespace
 * const patientContext = useAppContext<PatientContext>('patient');
 * ```
 *
 * @example
 * ```ts
 * // loads part of a namespace
 * const patientName = useAppContext<PatientContext, string | undefined>('patient', (state) => state.display);
 * ```
 *
 * @typeParam T The type of the value stored in the namespace
 * @typeParam U The return type of this hook which is mostly relevant when using a selector
 * @param namespace The namespace to load properties from
 * @param selector An optional function which extracts the relevant part of the state
 */
function useAppContext<T = unknown, U = T>(
  namespace: string,
  selector: (state: Readonly<T> | null) => U = (state) => state as unknown as U,
): U | undefined {
  const [value, setValue] = useState<U>();

  useEffect(() => {
    if (namespace === null || typeof namespace === 'undefined' || namespace.replace(' ', '') === '') {
      throw new Error(`The namespace supplied to useAppContext must be a non-empty string, but was "${namespace}".`);
    }
  }, [namespace]);

  useEffect(() => {
    return subscribeToContext<T>(namespace, (state) => {
      if (typeof state !== 'undefined') {
        const newValue = selector ? selector(state) : (state as unknown as U);
        if (!shallowEqual(value, newValue)) {
          setValue(newValue);
        }
      }
    });
  }, []);

  return value;
}

export default useAppContext;

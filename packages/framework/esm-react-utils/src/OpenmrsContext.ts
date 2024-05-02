/** @module @category Context */
import { useDefineAppContextNamespace } from './useDefineAppContextNamespace';

export interface OpenmrsAppContextProps<T = unknown> {
  /** the namespace that this component defines */
  namespace: string;
  /** used to control the value associated with the namespace */
  value?: T;
}

/**
 * OpenmrsAppContext is a simple React component meant to function similarly to React's Context,
 * but built on top of the OpenmrsAppContext.
 *
 * @example
 * ```ts
 *    <OpenmrsAppContext namespace="something" value={{ key: "1234" }} />
 * ```
 *
 * **Notes on usage:** Unlike a proper React context where the value is limited to the subtree under the
 * context component, the `OpenmrsAppContext` is inherently global in scope. That means that _all applications_
 * will see the values that you set for the namespace if they load the value of the namespace.
 */
export function OpenmrsAppContext<T extends {}>({ namespace, value }: OpenmrsAppContextProps<T>) {
  useDefineAppContextNamespace<T>(namespace, value);

  return null;
}

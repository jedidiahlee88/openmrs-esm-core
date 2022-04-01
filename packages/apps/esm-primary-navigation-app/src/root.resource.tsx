import {
  CurrentUserWithResponseOption,
  getCurrentUser,
  getSynchronizationItemsFor,
  openmrsObservableFetch,
} from "@openmrs/esm-framework/src/internal";
import { mergeMap } from "rxjs/operators";
import { userPropertyChange } from "./constants";

export function getCurrentSession() {
  return openmrsObservableFetch(`/ws/rest/v1/session`);
}

/**
 * Returns an observable producing the current user, but also applies any unsynchronized user property
 * changes to that user.
 */
export function getSynchronizedCurrentUser(
  opts: CurrentUserWithResponseOption
) {
  return getCurrentUser(opts).pipe(
    mergeMap(async (result) => {
      const { user } = result;

      if (user) {
        const allChanges = await getSynchronizationItemsFor<any>(
          user.uuid,
          userPropertyChange
        );
        Object.assign(user.userProperties, ...allChanges);
      }

      return result;
    })
  );
}

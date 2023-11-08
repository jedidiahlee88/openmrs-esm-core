import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  InlineLoading,
  Search,
  RadioButton,
  RadioButtonGroup,
  RadioButtonSkeleton,
} from "@carbon/react";
import {
  navigate,
  setSessionLocation,
  useConfig,
  useConnectivity,
  useSession,
} from "@openmrs/esm-framework";
import type { LoginReferrer } from "../login/login.component";
import { useLoginLocations } from "../login.resource";
import styles from "./location-picker.scss";
import { useDefaultLocation } from "./location-picker.resource";
import { ConfigSchema } from "../config-schema";

interface LocationPickerProps {
  hideWelcomeMessage?: boolean;
  currentLocationUuid?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  hideWelcomeMessage,
  currentLocationUuid,
}) => {
  const { t } = useTranslation();
  const config: ConfigSchema = useConfig();
  const { chooseLocation } = config;
  const isLoginEnabled = useConnectivity();
  const {
    defaultLocation,
    updateUserPreference,
    savePreference,
    setSavePreference,
    defaultLocationFhir,
  } = useDefaultLocation();

  const [searchTerm, setSearchTerm] = useState(null);

  const { user, sessionLocation } = useSession();
  const { currentUser, userProperties } = useMemo(
    () => ({
      currentUser: user?.display,
      userUuid: user?.uuid,
      userProperties: user?.userProperties,
    }),
    [user]
  );

  const {
    locations: fetchedLocations,
    isLoading,
    hasMore,
    loadingNewData,
    setPage,
  } = useLoginLocations(
    chooseLocation.useLoginLocationTag,
    chooseLocation.locationsPerRequest,
    searchTerm
  );

  const locations = useMemo(() => {
    if (!defaultLocationFhir?.length || !fetchedLocations) {
      return fetchedLocations;
    }
    return [
      ...(defaultLocationFhir ?? []),
      ...fetchedLocations?.filter(
        ({ resource }) => resource.id !== defaultLocationFhir?.[0].resource.id
      ),
    ];
  }, [defaultLocationFhir, fetchedLocations]);

  const [activeLocation, setActiveLocation] = useState(() => {
    if (currentLocationUuid && hideWelcomeMessage) {
      return currentLocationUuid;
    }
    return sessionLocation?.uuid ?? defaultLocation;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state } = useLocation() as { state: LoginReferrer };

  const changeLocation = useCallback(
    (locationUuid?: string, saveUserPreference?: boolean) => {
      setIsSubmitting(true);

      const referrer = state?.referrer;
      const returnToUrl = new URLSearchParams(location?.search).get(
        "returnToUrl"
      );

      const sessionDefined = locationUuid
        ? setSessionLocation(locationUuid, new AbortController())
        : Promise.resolve();

      updateUserPreference(locationUuid, saveUserPreference);
      sessionDefined.then(() => {
        if (
          referrer &&
          !["/", "/login", "/login/location"].includes(referrer)
        ) {
          navigate({ to: "${openmrsSpaBase}" + referrer });
          return;
        }
        if (returnToUrl && returnToUrl !== "/") {
          navigate({ to: returnToUrl });
        } else {
          navigate({ to: config.links.loginSuccess });
        }
        return;
      });
    },
    [state?.referrer, config.links.loginSuccess, updateUserPreference]
  );

  // Handle cases where the location picker is disabled, there is only one location, or there are no locations.
  useEffect(() => {
    if (!isLoading && !searchTerm) {
      if (!config.chooseLocation.enabled || locations?.length === 1) {
        changeLocation(locations[0]?.resource.id, false);
      }
      if (!locations?.length) {
        changeLocation();
      }
    }
  }, [
    changeLocation,
    config.chooseLocation.enabled,
    isLoading,
    locations,
    searchTerm,
  ]);

  // Handle cases where the login location is present in the userProperties.
  useEffect(() => {
    const isUpdateFlow =
      new URLSearchParams(location?.search).get("update") === "true";
    if (isUpdateFlow) {
      return;
    }
    if (defaultLocation && !isSubmitting) {
      setActiveLocation(defaultLocation);
      changeLocation(defaultLocation, true);
    }
  }, [changeLocation, isSubmitting, defaultLocation, setSavePreference]);

  const search = (location: string) => {
    setActiveLocation("");
    setSearchTerm(location);
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!activeLocation) return;

    changeLocation(activeLocation, savePreference);
  };

  // Infinite scroll
  const observer = useRef(null);
  const loadingIconRef = useCallback(
    (node) => {
      if (loadingNewData) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((page) => page + 1);
          }
        },
        {
          threshold: 1,
        }
      );
      if (node) observer.current.observe(node);
    },
    [loadingNewData, hasMore, setPage]
  );

  return (
    <div className={styles.locationPickerContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.locationCard}>
          <div className={styles.paddedContainer}>
            <p className={styles.welcomeTitle}>
              {t("welcome", "Welcome")} {currentUser}
            </p>
            <p className={styles.welcomeMessage}>
              {t(
                "selectYourLocation",
                "Select your location from the list below. Use the search bar to find your location."
              )}
            </p>
          </div>
          <Search
            autoFocus
            labelText={t("searchForLocation", "Search for a location")}
            id="search-1"
            placeholder={t("searchForLocation", "Search for a location")}
            onChange={(event) => search(event.target.value)}
            name="searchForLocation"
            size="lg"
          />
          <div className={styles.searchResults}>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <RadioButtonSkeleton
                  className={styles.radioButtonSkeleton}
                  role="progressbar"
                />
                <RadioButtonSkeleton
                  className={styles.radioButtonSkeleton}
                  role="progressbar"
                />
                <RadioButtonSkeleton
                  className={styles.radioButtonSkeleton}
                  role="progressbar"
                />
                <RadioButtonSkeleton
                  className={styles.radioButtonSkeleton}
                  role="progressbar"
                />
                <RadioButtonSkeleton
                  className={styles.radioButtonSkeleton}
                  role="progressbar"
                />
              </div>
            ) : (
              <>
                <div className={styles.locationResultsContainer}>
                  {locations?.length > 0 ? (
                    <RadioButtonGroup
                      valueSelected={activeLocation}
                      orientation="vertical"
                      name="Login locations"
                      onChange={(ev) => {
                        setActiveLocation(ev.toString());
                      }}
                    >
                      {locations.map((entry) => (
                        <RadioButton
                          className={styles.locationRadioButton}
                          key={entry.resource.id}
                          id={entry.resource.name}
                          name={entry.resource.name}
                          labelText={entry.resource.name}
                          value={entry.resource.id}
                        />
                      ))}
                    </RadioButtonGroup>
                  ) : (
                    <div className={styles.emptyState}>
                      <p className={styles.locationNotFound}>
                        {t("noResultsToDisplay", "No results to display")}
                      </p>
                    </div>
                  )}
                </div>
                {hasMore && (
                  <div className={styles.loadingIcon} ref={loadingIconRef}>
                    <InlineLoading description={t("loading", "Loading")} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className={styles.confirmButton}>
            <Checkbox
              id="checkbox"
              className={styles.savePreferenceCheckbox}
              labelText={t(
                "rememberLocationForFutureLogins",
                "Remember my location for future logins"
              )}
              checked={savePreference}
              onChange={(_, { checked }) => setSavePreference(checked)}
            />
            <Button
              kind="primary"
              type="submit"
              disabled={!activeLocation || !isLoginEnabled || isSubmitting}
            >
              {isSubmitting ? (
                <InlineLoading
                  className={styles.loader}
                  description={t("submitting", "Submitting")}
                />
              ) : (
                <span>{t("confirm", "Confirm")}</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LocationPicker;

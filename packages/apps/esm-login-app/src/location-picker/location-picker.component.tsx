import React, { useState, useEffect, useRef, useCallback, LegacyRef, useMemo } from 'react';
import { useLocation, type Location, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
  InlineLoading,
  Search,
  RadioButton,
  RadioButtonGroup,
  RadioButtonSkeleton,
} from '@carbon/react';
import {
  navigate,
  setSessionLocation,
  setUserProperties,
  showSnackbar,
  useConfig,
  useConnectivity,
  useSession,
} from '@openmrs/esm-framework';
import type { LoginReferrer } from '../login/login.component';
import styles from './location-picker.scss';
import {
  // useDefaultLocation,
  useLoginLocations,
  getUserPropertiesWithDefaultAndLogInLocation,
} from './location-picker.resource';
import type { ConfigSchema } from '../config-schema';

interface LocationPickerProps {}

const LocationPicker: React.FC<LocationPickerProps> = () => {
  const { t } = useTranslation();
  const config = useConfig<ConfigSchema>();
  const { chooseLocation } = config;
  const isLoginEnabled = useConnectivity();
  const [searchTerm, setSearchTerm] = useState(null);
  const [searchParams] = useSearchParams();
  const [activeLocation, setActiveLocation] = useState<string>(null);
  const [saveDefaultLocation, setSaveDefaultLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isUpdateFlow = useMemo(() => searchParams.get('update') === 'true', [searchParams]);
  const { state } = useLocation() as unknown as Omit<Location, 'state'> & {
    state: LoginReferrer;
  };

  const { user, sessionLocation } = useSession();
  const { currentUser } = useMemo(
    () => ({
      currentUser: user?.display,
      userUuid: user?.uuid,
      userProperties: user?.userProperties,
    }),
    [user],
  );

  const {
    locations,
    isLoadingLocations,
    hasMore,
    loadingNewData,
    setPage,
    isDefaultLocationValid,
    defaultLocation,
    lastLoggedInLocation,
  } = useLoginLocations(chooseLocation.useLoginLocationTag, chooseLocation.locationsPerRequest, searchTerm);

  const updateUserProperties = useCallback(
    (locationUuid: string) => {
      const { previousLoggedInLocations, defaultLocation } = getUserPropertiesWithDefaultAndLogInLocation(
        locationUuid,
        user?.userProperties?.previousLoggedInLocations,
      );

      const prevUserProperties = user?.userProperties;

      const updatedUserProperties = {
        ...(user?.userProperties ?? {}),
        previousLoggedInLocations,
        defaultLocation,
      };

      if (!saveDefaultLocation) {
        delete updatedUserProperties.defaultLocation;
      }

      setUserProperties(user?.uuid, updatedUserProperties).then(() => {
        if (saveDefaultLocation) {
          showSnackbar({
            title: !isUpdateFlow ? t('locationSaved', 'Location saved') : t('locationUpdated', 'Location updated'),
            subtitle: !isUpdateFlow
              ? t('locationSaveMessage', 'Your preferred location has been saved for future logins')
              : t('locationUpdateMessage', 'Your preferred login location has been updated'),
            kind: 'success',
            isLowContrast: true,
          });
        } else if (prevUserProperties.defaultLocation && !updatedUserProperties.defaultLocation) {
          showSnackbar({
            title: t('locationPreferenceRemoved', 'Location preference removed'),
            subtitle: t('locationPreferenceRemovedMessage', 'You will need to select a location on each login'),
            kind: 'success',
            isLowContrast: true,
          });
        }
      });
    },
    [user?.uuid, user?.userProperties, saveDefaultLocation],
  );

  const changeLocation = useCallback(
    (locationUuid?: string, saveUserPreference?: boolean) => {
      setIsSubmitting(true);

      const referrer = state?.referrer;
      const returnToUrl = new URLSearchParams(location?.search).get('returnToUrl');

      const sessionDefined = locationUuid ? setSessionLocation(locationUuid, new AbortController()) : Promise.resolve();
      updateUserProperties(locationUuid);
      sessionDefined.then(() => {
        if (referrer && !['/', '/login', '/login/location'].includes(referrer)) {
          navigate({ to: '${openmrsSpaBase}' + referrer });
          return;
        }
        if (returnToUrl && returnToUrl !== '/') {
          navigate({ to: returnToUrl });
        } else {
          navigate({ to: config.links.loginSuccess });
        }
        return;
      });
    },
    [state?.referrer, config.links.loginSuccess, updateUserProperties],
  );

  useEffect(() => {
    // Handle cases where the location picker is disabled, there is only one location, or there are no locations.
    if (!isLoadingLocations && !searchTerm) {
      if (!config.chooseLocation.enabled || locations?.length === 1) {
        changeLocation(locations[0]?.resource.id, false);
      }
      if (!locations?.length) {
        changeLocation();
      }
    }
  }, [changeLocation, config.chooseLocation.enabled, isLoadingLocations, locations, searchTerm]);

  useEffect(() => {
    if (lastLoggedInLocation && !activeLocation) {
      setActiveLocation(sessionLocation?.uuid ?? lastLoggedInLocation);
    }
  }, [lastLoggedInLocation, activeLocation, setActiveLocation]);

  useEffect(() => {
    if (isDefaultLocationValid) {
      setSaveDefaultLocation(true);
    }
  }, [setSaveDefaultLocation, isDefaultLocationValid]);

  useEffect(() => {
    // Handle cases where the login location is present in the userProperties.
    if (!isUpdateFlow && defaultLocation && !isSubmitting) {
      setActiveLocation(defaultLocation);
      changeLocation(defaultLocation, true);
    }
  }, [changeLocation, isSubmitting, defaultLocation, isUpdateFlow]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      if (!activeLocation) return;
      changeLocation(activeLocation, saveDefaultLocation);
    },
    [activeLocation, changeLocation, saveDefaultLocation],
  );

  const handleFetchNextSet = useCallback(() => {
    setPage((page) => page + 1);
  }, [setPage]);

  const observer = useRef(null);
  const loadingIconRef = useCallback(
    (node: HTMLDivElement) => {
      if (loadingNewData) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            handleFetchNextSet();
          }
        },
        {
          threshold: 1,
        },
      );
      if (node) observer.current.observe(node);
    },
    [loadingNewData, hasMore, handleFetchNextSet],
  );

  const reloadIndex = hasMore ? Math.floor(locations.length * 0.5) : -1;

  return (
    <div className={styles.locationPickerContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.locationCard}>
          <div className={styles.paddedContainer}>
            <p className={styles.welcomeTitle}>
              {t('welcome', 'Welcome')} {currentUser}
            </p>
            <p className={styles.welcomeMessage}>
              {t(
                'selectYourLocation',
                'Select your location from the list below. Use the search bar to find your location.',
              )}
            </p>
          </div>
          <Search
            autoFocus
            labelText={t('searchForLocation', 'Search for a location')}
            id="search-1"
            placeholder={t('searchForLocation', 'Search for a location')}
            onChange={handleSearch}
            name="searchForLocation"
            size="lg"
            value={searchTerm}
          />
          <div className={styles.searchResults}>
            {isLoadingLocations ? (
              <div className={styles.loadingContainer}>
                <RadioButtonSkeleton className={styles.radioButtonSkeleton} role="progressbar" />
                <RadioButtonSkeleton className={styles.radioButtonSkeleton} role="progressbar" />
                <RadioButtonSkeleton className={styles.radioButtonSkeleton} role="progressbar" />
                <RadioButtonSkeleton className={styles.radioButtonSkeleton} role="progressbar" />
                <RadioButtonSkeleton className={styles.radioButtonSkeleton} role="progressbar" />
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
                      {locations.map((entry, i) => (
                        <RadioButton
                          className={styles.locationRadioButton}
                          key={entry.resource.id}
                          id={entry.resource.name}
                          name={entry.resource.name}
                          labelText={`${entry.resource.name} ${entry.resource.id.slice(0, 6)}`}
                          value={entry.resource.id}
                          ref={i === reloadIndex ? loadingIconRef : null}
                        />
                      ))}
                    </RadioButtonGroup>
                  ) : (
                    <div className={styles.emptyState}>
                      <p className={styles.locationNotFound}>{t('noResultsToDisplay', 'No results to display')}</p>
                    </div>
                  )}
                </div>
                {hasMore && (
                  <div className={styles.loadingIcon}>
                    <InlineLoading description={t('loading', 'Loading')} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className={styles.confirmButton}>
            <Checkbox
              id="checkbox"
              className={styles.saveDefaultLocationCheckbox}
              labelText={t('rememberLocationForFutureLogins', 'Remember my location for future logins')}
              checked={saveDefaultLocation}
              onChange={(_, { checked }) => setSaveDefaultLocation(checked)}
            />
            <Button kind="primary" type="submit" disabled={!activeLocation || !isLoginEnabled || isSubmitting}>
              {isSubmitting ? (
                <InlineLoading className={styles.loader} description={t('submitting', 'Submitting')} />
              ) : (
                <span>{t('confirm', 'Confirm')}</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LocationPicker;

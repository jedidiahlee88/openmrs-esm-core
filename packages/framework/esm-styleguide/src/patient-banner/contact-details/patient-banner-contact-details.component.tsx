/** @module @category UI */
import React, { useMemo } from 'react';
import { InlineLoading } from '@carbon/react';
import { type CoreTranslationKey, getCoreTranslation } from '@openmrs/esm-translations';
import { ConfigurableLink, usePatient } from '@openmrs/esm-react-utils';
import { parseDate } from '@openmrs/esm-utils';
import { useRelationships } from './useRelationships';
import { usePatientContactAttributes } from './usePatientAttributes';
import { usePatientListsForPatient } from './usePatientListsForPatient';
import styles from './patient-banner-contact-details.module.scss';
import classNames from 'classnames';

interface ContactDetailsProps {
  patientId: string;
  deceased: boolean;
}

const PatientLists: React.FC<{ patientUuid: string }> = ({ patientUuid }) => {
  const { cohorts = [], isLoading } = usePatientListsForPatient(patientUuid);

  return (
    <>
      <p className={styles.heading}>
        {getCoreTranslation('patientLists', 'Patient Lists')} ({cohorts?.length ?? 0})
      </p>
      {isLoading ? (
        <InlineLoading description={`${getCoreTranslation('loading', 'Loading')} ...`} role="progressbar" />
      ) : (
        <ul>
          {(() => {
            if (cohorts?.length > 0) {
              const sortedLists = cohorts.sort(
                (a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime(),
              );
              const slicedLists = sortedLists.slice(0, 3);
              return slicedLists?.map((cohort) => (
                <li key={cohort.uuid}>
                  <ConfigurableLink to={`${window.spaBase}/home/patient-lists/${cohort.uuid}`} key={cohort.uuid}>
                    {cohort.name}
                  </ConfigurableLink>
                </li>
              ));
            }
            return <li>--</li>;
          })()}
          <li style={{ marginTop: '1rem' }}>
            <ConfigurableLink to={`${window.spaBase}/home/patient-lists`}>
              {cohorts.length > 3
                ? getCoreTranslation('seeMoreLists', 'See {{count}} more lists', {
                    count: cohorts?.length - 3,
                  })
                : ''}
            </ConfigurableLink>
          </li>
        </ul>
      )}
    </>
  );
};

const Address: React.FC<{ patientId: string }> = ({ patientId }) => {
  const { patient } = usePatient(patientId);
  const address = patient?.address?.find((a) => a.use === 'home');
  const getAddressKey = (url) => url.split('#')[1];

  return (
    <>
      <p className={styles.heading}>{getCoreTranslation('address', 'Address')}</p>
      <ul>
        {address ? (
          Object.entries(address)
            .filter(([key]) => key !== 'id')
            .map(([key, value]) =>
              key === 'extension' ? (
                address.extension?.[0]?.extension?.map((add, i) => (
                  <li key={`address-${key}-${i}`}>
                    {getCoreTranslation(getAddressKey(add.url), getAddressKey(add.url))}: {add.valueString}
                  </li>
                ))
              ) : (
                <li key={`address-${key}`}>
                  {getCoreTranslation(key as CoreTranslationKey, key)}: {value}
                </li>
              ),
            )
        ) : (
          <li>--</li>
        )}
      </ul>
    </>
  );
};

const Contact: React.FC<{ patientUuid: string; deceased?: boolean }> = ({ patientUuid }) => {
  const { isLoading: isLoadingAttributes, contactAttributes } = usePatientContactAttributes(patientUuid);

  const contacts = useMemo(
    () =>
      contactAttributes
        ? [
            ...contactAttributes?.map((contact) => [
              contact.attributeType.display
                ? getCoreTranslation(
                    /** TODO: We should probably add translation strings for some of these */
                    contact.attributeType.display as CoreTranslationKey,
                    contact.attributeType.display,
                  )
                : '',
              contact.value,
            ]),
          ]
        : [],
    [contactAttributes],
  );

  return (
    <>
      <p className={styles.heading}>{getCoreTranslation('contactDetails', 'Contact Details')}</p>
      {isLoadingAttributes ? (
        <InlineLoading description={`${getCoreTranslation('loading', 'Loading')} ...`} role="progressbar" />
      ) : (
        <ul>
          {contacts.length ? (
            contacts.map(([label, value], index) => (
              <li key={`${label}-${value}-${index}`}>
                {label}: {value}
              </li>
            ))
          ) : (
            <li>--</li>
          )}
        </ul>
      )}
    </>
  );
};

const Relationships: React.FC<{ patientId: string }> = ({ patientId }) => {
  const { data: relationships, isLoading } = useRelationships(patientId);

  return (
    <>
      <p className={styles.heading}>{getCoreTranslation('relationships', 'Relationships')}</p>
      {isLoading ? (
        <InlineLoading description={`${getCoreTranslation('loading', 'Loading')} ...`} role="progressbar" />
      ) : (
        <ul>
          {relationships && relationships.length > 0 ? (
            <>
              {relationships.map((r) => (
                <li key={r.uuid} className={styles.relationship}>
                  <div>{r.display}</div>
                  <div>{r.relationshipType}</div>
                  <div>
                    {`${r.relativeAge ? r.relativeAge : '--'} ${
                      r.relativeAge ? (r.relativeAge === 1 ? 'yr' : 'yrs') : ''
                    }`}
                  </div>
                </li>
              ))}
            </>
          ) : (
            <li>--</li>
          )}
        </ul>
      )}
    </>
  );
};

export function PatientBannerContactDetails({ patientId, deceased }: ContactDetailsProps) {
  return (
    <div className={classNames(deceased && styles.deceased, styles.contactDetails)}>
      <div className={styles.row}>
        <div className={styles.col}>
          <Address patientId={patientId} />
        </div>
        <div className={styles.col}>
          <Contact patientUuid={patientId} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.col}>
          <Relationships patientId={patientId} />
        </div>
        <div className={styles.col}>
          <PatientLists patientUuid={patientId} />
        </div>
      </div>
    </div>
  );
}

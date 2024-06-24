import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.scss';
import { navigate } from '@openmrs/esm-framework';

const Docs = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    window.open('https://o3-docs.openmrs.org/', '_blank');
  };

  return (
    <div onClick={handleClick} className={styles.helpButton}>
      {t('docs', 'Docs')}
    </div>
  );
};

export default Docs;

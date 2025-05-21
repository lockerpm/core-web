import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Alert,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import common from '../../../utils/common';

function AlertWarning(props) {
  const { t } = useTranslation();
  const {
    folderId
  } = props

  const allCollections = useSelector((state) => state.collection.allCollections);

  const showWarning = useMemo(() => {
    const collection = allCollections.find((c) => c.id === folderId);
    if (collection) {
      return common.isChangeCipher(collection) && !common.isOwner(collection)
    }
    return false
  }, [folderId, allCollections])

  return (
    <>
      {
        showWarning ? <Alert
          style={{ padding: 12 }}
          message={
            <p
              className={`text-warning`}
            >
              {t('cipher.folder_shared_note')}
            </p>
          }
          type={'warning'}
        /> : <></>
      }
    </>
  );
}

export default AlertWarning;

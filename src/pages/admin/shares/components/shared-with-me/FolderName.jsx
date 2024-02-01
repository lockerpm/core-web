import React, { useMemo } from "react";
import {
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import components from '../../../../../components';

import {
} from "@ant-design/icons";

import Name from "../../../folders/components/Name";

const FolderName = (props) => {
  const {
    TextCopy,
    ImageIcon
  } = components;
  const { t } = useTranslation()
  const { folder = {} } = props;
  const allCollections = useSelector((state) => state.collection.allCollections)

  const originCollection = useMemo(() => {
    return allCollections.find((d) => d.id === folder.id)
  }, [allCollections, folder])

  return (
    <div className="flex items-center">
      {
        originCollection ? <Name item={originCollection}/> : <div className="flex items-center">
          <ImageIcon
            name={'any-icon'}
            width={32}
            height={32}
          />
          <TextCopy
            className="ml-2"
            value={t('shares.encrypted_content')}
          />
        </div>
      }
    </div>
  );
}

export default FolderName;
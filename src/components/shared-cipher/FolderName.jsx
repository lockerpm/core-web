import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../items";
import folderComponents from "../folder";

const FolderName = (props) => {
  const { TextCopy, ImageIcon } = itemsComponents;
  const { Name } = folderComponents;
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
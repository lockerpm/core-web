import React, { useMemo } from "react";
import {
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
  ImageIcon
} from '../../../../../../components';

import {
} from "@ant-design/icons";

import FolderName from "../../../../folders/components/table/Name";

const Name = (props) => {
  const { t } = useTranslation()
  const { folder = {} } = props;
  const allFolders = useSelector((state) => state.folder.allFolders)

  const originFolder = useMemo(() => {
    return allFolders.find((d) => d.id === folder.id)
  }, [allFolders, folder])

  return (
    <div className="flex items-center">
      {
        originFolder ? <FolderName item={folder}/> : <div className="flex items-center">
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

export default Name;
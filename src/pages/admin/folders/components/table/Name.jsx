import React, { useMemo } from "react";
import {
  Image
} from '@lockerpm/design';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  TextCopy,
  RouterLink,
  ImageIcon
} from '../../../../../components';

import {
} from "@ant-design/icons";

import global from "../../../../../config/global";

const Name = (props) => {
  const { t } = useTranslation()
  const { folder = {} } = props;
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const folderCiphers = useMemo(() => {
    return allCiphers.filter((c) => c.folderId === folder?.id && !c.isDeleted)
  }, [folder, allCiphers])
  return (
    <div className="flex items-center">
      <ImageIcon
        className="ml-1"
        name={'folder'}
        width={32}
        height={32}
      />
      <div className="ml-2 flex-1">
        <div className="flex items-center">
          <RouterLink
            className={'font-semibold'}
            label={folder.name}
            routerName={global.keys.FOLDER_DETAIL}
            routerParams={{ folder_id: folder.id }}
          />
        </div>
        <TextCopy
          className="text-sm font-semibold"
          value={`${folderCiphers.length} ${t('common.items')}`}
        />
      </div>
    </div>
  );
}

export default Name;
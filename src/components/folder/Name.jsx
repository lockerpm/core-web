import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../items";

import global from "../../config/global";

const Name = (props) => {
  const {
    TextCopy,
    RouterLink,
    ImageIcon
  } = itemsComponents;

  const { t } = useTranslation()
  const { item = {}, showItems = true } = props;
  const allCiphers = useSelector((state) => state.cipher.allCiphers)
  const allFolders = useSelector((state) => state.folder.allFolders)
  const allCollections = useSelector((state) => state.collection.allCollections)

  const originFolder = useMemo(() => {
    return [...allFolders, ...allCollections].find((c) => c.id === item?.id)
  }, [allFolders, allCollections])

  const folderCiphers = useMemo(() => {
    return allCiphers.filter((c) => c.folderId === item?.id && !c.isDeleted)
  }, [item, allCiphers])

  const collectionCiphers = useMemo(() => {
    return allCiphers.filter((c) => c.collectionIds && c.collectionIds[0] === item?.id)
  }, [item, allCiphers])

  return (
    <div className="flex items-center">
      <ImageIcon
        name={originFolder.isCollection ? 'folder-share' : 'folder'}
        width={32}
        height={32}
      />
      <div className="ml-2 flex-1">
        <div className="flex items-center">
          <RouterLink
            className={'font-semibold'}
            label={originFolder.name}
            routerName={global.keys.FOLDER_DETAIL}
            routerParams={{ folder_id: originFolder.id }}
          />
        </div>
        {
          showItems && <TextCopy
            className="text-xs"
            value={`${[...folderCiphers, ...collectionCiphers].length} ${t('common.items')}`}
          />
        }
      </div>
    </div>
  );
}

export default Name;
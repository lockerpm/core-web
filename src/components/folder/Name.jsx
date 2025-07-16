import React, { useMemo } from "react";
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { useLocation } from 'react-router-dom';

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import itemsComponents from "../items";

import common from "../../utils/common";

const Name = (props) => {
  const {
    TextCopy,
    RouterLink,
    ImageIcon
  } = itemsComponents;

  const { t } = useTranslation()
  const location = useLocation();

  const { item = {}, showItems = true } = props;
  const currentPage = common.getRouterByLocation(location);

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

  const routerName = useMemo(() => {
    return common.getFolderRouterName(currentPage)
  }, [currentPage])

  const routerParams = useMemo(() => {
    return common.getFolderRouterNameParams(originFolder?.id)
  }, [originFolder])


  return (
    <div className="flex items-center w-full">
      <ImageIcon
        name={originFolder?.isCollection ? 'folder-share' : 'folder'}
        width={32}
        height={32}
      />
      <div className="ml-2" style={{ width: 'calc(100% - 40px)' }}>
        <div className="flex items-center">
          <RouterLink
            className={'font-semibold'}
            label={originFolder?.name}
            routerName={routerName}
            routerParams={routerParams}
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
import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Form,
  Select,
} from '@lockerpm/design';

import {
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import common from '../../../../../utils/common';

function FolderShare(props) {
  const {
  } = props
  const { t } = useTranslation()

  const allFolders = useSelector((state) => state.folder.allFolders)
  const allCollections = useSelector((state) => state.collection.allCollections)

  const [searchText, setSearchText] = useState('')

  const folderOptions = useMemo(() => {
    return [
      ...allFolders
        .filter((c) => !!c.id),
      ...allCollections
        .filter((c) => !!c.id && common.isOwner(c))
    ]
      .filter((c) => c.name?.toLowerCase()?.includes(searchText))
      .map((c) => ({ label: c.name, value: c.id }))
  }, [allFolders, allCollections, searchText])


  return (
    <div>
      <Form.Item
        name={'folder'}
        label={
          <div>
            <p className='font-semibold'>
              {t('shares.new_share.choose_folder')}
            </p>
          </div>
        }
      >
        <Select
          placeholder={t('shares.new_share.search_folder')}
          options={folderOptions}
          onSearch={(v) => setSearchText(v)}
        />
      </Form.Item>
      <ShareMembers />
    </div>
  );
}

export default FolderShare;

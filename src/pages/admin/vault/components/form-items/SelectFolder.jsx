import React, { useMemo, useState, useEffect } from 'react';
import {
  Select,
  Form,
  Divider,
  Button
} from '@lockerpm/design';
import {
  PlusOutlined
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import common from '../../../../../utils/common';

function SelectFolder(props) {
  const {
    disabled = false,
    isMove = false,
    folderId = null,
    onCreate = () => {},
  } = props
  const { t } = useTranslation();

  const allFolders = useSelector((state) => state.folder.allFolders);
  const allCollections = useSelector((state) => state.collection.allCollections);

  const canChangeFolder = useMemo(() => {
    const memberCollections = allCollections.filter((c) => !common.isOwner(c))
    if (folderId) {
      return !memberCollections.some(f => f.id === folderId)
    }
    return true
  }, [allCollections])

  const options = useMemo(() => {
    const ownerCollections = allCollections.filter((c) => common.isOwner(c))
    const result = [
      ...allFolders,
      ...((isMove || canChangeFolder) ? ownerCollections : allCollections)
    ].map((f) => ({ value: f.id, label: f.name }))
    return [
      {
        value: '',
        label: t('cipher.no_folder')
      },
      ...result
    ]
  }, [allFolders, allCollections, canChangeFolder, isMove])

  return (
    <div className={props.className}>
      <Form.Item
        name={'folderId'}
        className='mb-2'
        label={
          <p className='font-semibold'>{t('cipher.select_folder')}</p>
        }
      >
        <Select
          className='w-full'
          disabled={disabled || !canChangeFolder}
          placeholder={t('placeholder.select')}
          options={options}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider className='my-1'/>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={onCreate}
                className='text-primary'
              >
                {t('cipher.add_folder')}
              </Button>
            </>
          )}
        />
      </Form.Item>
    </div>
  );
}

export default SelectFolder;

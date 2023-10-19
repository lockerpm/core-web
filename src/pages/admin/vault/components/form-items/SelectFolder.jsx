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

import commonServices from '../../../../../services/common';

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

  const [writeableCollections, setWriteableCollections] = useState([]);
  const [nonWriteableCollections, setNonWriteableCollections] = useState([]);

  useEffect(() => {
    initData();
  }, [])

  const initData = async () => {
    setWriteableCollections(await commonServices.get_writable_collections());
    setNonWriteableCollections(await commonServices.get_writable_collections(true))
  }

  const canChangeFolder = useMemo(() => {
    if (folderId) {
      return !nonWriteableCollections.some(f => f.id === folderId)
    }
    return true
  }, [nonWriteableCollections])

  const options = useMemo(() => {
    const result = [
      ...allFolders,
      ...(isMove || canChangeFolder ? writeableCollections : allCollections)
    ].map((f) => ({ value: f.id, label: f.name }))
    return [
      {
        value: '',
        label: t('cipher.no_folder')
      },
      ...result
    ]
  }, [allFolders, writeableCollections, allCollections, canChangeFolder, isMove])

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

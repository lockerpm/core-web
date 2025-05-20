import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Select,
  Form,
  Divider,
  Button
} from '@lockerpm/design';

import {
  PlusOutlined
} from '@ant-design/icons';

import common from '../../../utils/common';

function SelectFolder(props) {
  const {
    disabled = false,
    item = null,
    onCreate = () => {},
  } = props
  const { t } = useTranslation();

  const allFolders = useSelector((state) => state.folder.allFolders);
  const allCollections = useSelector((state) => state.collection.allCollections);
  const locale = useSelector((state) => state.system.locale);

  const originFolder = useMemo(() => {
    return [...allFolders, ...allCollections].find((c) => c.id === item?.folderId)
  }, [allFolders, allCollections, item])

  const canChangeFolder = useMemo(() => {
    if (originFolder) {
      return common.isOwner(originFolder)
    }
    if (item) {
      return common.isOwner(item) || (common.isChangeCipher(item) && !item.collectionIds.length)
    }
    return true
  }, [originFolder, item])

  const options = useMemo(() => {
    const result = [
      ...allFolders,
      ...allCollections
    ].map((f) => ({
      value: f.id,
      label: f.name,
      disabled: !common.isChangeCipher(f)
    }))
    return [
      {
        value: '',
        label: t('cipher.no_folder')
      },
      ...result
    ]
  }, [
    allFolders,
    allCollections,
    locale
  ])

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

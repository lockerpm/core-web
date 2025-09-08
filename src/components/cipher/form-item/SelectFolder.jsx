import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Select,
  Form,
  Divider,
  Button,
  Tooltip
} from '@lockerpm/design';

import {
  PlusOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

import common from '../../../utils/common';

function SelectFolder(props) {
  const {
    disabled = false,
    item = null,
    placement = "bottomLeft",
    onCreate = () => {},
  } = props
  const { t } = useTranslation();

  const allFolders = useSelector((state) => state.folder.allFolders);
  const allCollections = useSelector((state) => state.collection.allCollections);
  const locale = useSelector((state) => state.system.locale);

  const [searchText, setSearchText] = useState('')

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
    ]
    .filter((f) => {
      return f.name?.toLowerCase()?.includes(searchText?.toLowerCase())
    })
    .map((f) => ({
      value: f.id,
      label: <div className='flex items-center justify-between gap-2'>
        <span className='flex-1 text-limited' title={f.name}>
          {f.name}
        </span>
        {
          !common.isOwner(f) && common.isChangeCipher(f) && <Tooltip
            placement='topRight'
            title={t('cipher.folder_shared_note')}
          >
            <InfoCircleOutlined className='text-warning'/>
          </Tooltip>
        }
      </div>,
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
    locale,
    searchText
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
          placement={placement}
          showSearch
          filterOption={false}
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
          onSearch={(v) => setSearchText(v)}
        />
      </Form.Item>
    </div>
  );
}

export default SelectFolder;

import React, { useMemo, useState, useRef, useEffect } from 'react';
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

import global from '../../../../../config/global';

function SelectFolder(props) {
  const {
    disabled = false,
    isMove = false,
    onCreate = () => {}
  } = props
  const { t } = useTranslation()

  const allCollections = useSelector((state) => state.collection.allCollections)
  const allOrganizations = useSelector((state) => state.organization.allOrganizations)
  const allFolders = useSelector((state) => state.folder.allFolders);

  const options = useMemo(() => {
    const result = allFolders.map((f) => ({
      value: f.id,
      label: f.name
    }))
    if (isMove) {
      return result
    }
    return [
      {
        value: '',
        label: t('cipher.no_folder')
      },
      ...result
    ]
  }, [allFolders, isMove])

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
          disabled={disabled}
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

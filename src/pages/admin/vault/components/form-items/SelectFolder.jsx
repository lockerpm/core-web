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
  const { form } = props
  const { t } = useTranslation()

  const allFolders = useSelector((state) => state.folder.allFolders)
  useEffect(() => {
  }, [])

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
          options={[
            {
              value: '',
              label: t('cipher.no_folder')
            },
            ...allFolders.map((f) => ({
              value: f.id,
              label: f.name
            }))
          ]}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider className='my-1'/>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={() => {}}
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

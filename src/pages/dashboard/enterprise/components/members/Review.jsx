import React, { useEffect, useState } from 'react';
import {
  Space,
  Button,
  Drawer,
  Divider
} from '@lockerpm/design';
import {
  TextCopy
} from '../../../../../components'
import {
  ArrowDownOutlined
} from '@ant-design/icons';

import { } from 'react-redux';
import { useTranslation, Trans } from "react-i18next";
import { blue } from '@ant-design/colors';

import common from '../../../../../utils/common';
function FormData(props) {
  const {
    visible = false,
    mailConfig = null,
    members = [],
    onClose = () => { },
  } = props
  const { t } = useTranslation()

  const handleDownload = async () => {
    const rows = [
      [t('common.email'), t('auth_pages.password')],
      ...members.map((m) => [m.username, m.password])
    ]
    common.downloadCSV(rows)
    onClose()
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t('enterprise_members.new')}
        placement="right"
        closable={!!mailConfig}
        open={visible}
        onClose={onClose}
        footer={
          <Space className='flex items-center justify-end'>
            <Button
              type="primary"
              onClick={handleDownload}
              icon={<ArrowDownOutlined />}
            >
              {t('button.download')}
            </Button>
          </Space>
        }
      >
        <div>
          <p
            className='font-semibold text-lg'
          >
            {t('enterprise_members.form.new_member_info')}
          </p>
          <p className='mb-4'>
            <Trans
              i18nKey='enterprise_members.new_member_description'
              values={{
                mail: t('email_settings.title'),
              }}
            />
          </p>
          {
            members.map((m, index) => <div key={index}>
              <TextCopy
                value={m.username}
              />
              <TextCopy
                isPassword={true}
                value={m.password}
              />
              <Divider className='my-2' />
            </div>)
          }
        </div>
      </Drawer>
    </div>
  );
}

export default FormData;

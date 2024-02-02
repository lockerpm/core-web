import React, { } from 'react';
import { } from 'react-redux';
import { useTranslation, Trans } from "react-i18next";

import {
  Space,
  Button,
  Drawer,
  Divider
} from '@lockerpm/design';

import {
  ArrowDownOutlined
} from '@ant-design/icons';

import { } from '@ant-design/colors';

import itemsComponents from '../../../../../components/items';

import common from '../../../../../utils/common';

const { TextCopy } = itemsComponents;

function Review(props) {
  const {
    visible = false,
    members = [],
    onClose = () => { },
  } = props
  const { t } = useTranslation()

  const handleDownload = async () => {
    const rows = [
      [t('common.email'), t('auth_pages.password')],
      ...members.map((m) => [m.email, m.password])
    ]
    common.downloadCSV(rows)
    onClose()
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t('enterprise_members.add')}
        placement="right"
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
              i18nKey='enterprise_members.form.new_member_description'
              values={{
                mail: t('email_settings.title'),
              }}
            />
          </p>
          {
            members.map((m, index) => <div key={index}>
              <TextCopy
                value={m.email}
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

export default Review;

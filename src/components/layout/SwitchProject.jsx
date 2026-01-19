import React, { } from 'react';

import { useTranslation } from "react-i18next";

import {
  Button,
  Dropdown,
} from '@lockerpm/design';

import {
  KeyOutlined,
  LockOutlined
} from '@ant-design/icons';

import common from '../../utils/common';

function SwitchProject() {
  const { t } = useTranslation();

  const dropdownClick = async (item) => {
    if (item.key === 'secrets') {
      common.openNewTab(process.env.REACT_APP_LOCKER_SECRETS_URL)
    }
  }

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'password',
            icon: <LockOutlined />,
            label: <span>{t('sidebar.password_manager')}</span>
          },
          {
            key: 'secrets',
            icon: <KeyOutlined />,
            label: <span>{t('sidebar.secrets_manager')}</span>,
          },
        ],
        defaultSelectedKeys: ['password'],
        onClick: dropdownClick
      }}
      placement="bottomLeft"
      trigger={'click'}
    >
      <div>
        <Button
          type="primary"
          ghost
          className='avatar-button'
          shape='circle'
          icon={<LockOutlined/>}
        />
      </div>
    </Dropdown>
  );
}

export default SwitchProject;

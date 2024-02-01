import React, { } from 'react';
import {
  Space,
  Image,
  Button,
} from '@lockerpm/design';

import '../css/sidebar-top.scss';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import IconLogo from '../../../assets/images/logos/icon-logo.svg'
import DropdownMenu from './DropdownMenu';
import global from '../../../config/global';

import { gray } from '@ant-design/colors';

import {
} from '@ant-design/icons'

function SidebarTop(props) {
  const { collapsed } = props
  const { t } = useTranslation();

  const handleClickLogo = () => {
    global.navigate(global.keys.VAULT)
  }

  return (
    <div className="admin-layout-sidebar-top">
      <div className='flex items-center'>
        <Space wrap size={64}>
          <Button
            type='text'
            size={'large'}
            icon={
              <Image
                className='icon-logo'
                src={IconLogo}
                preview={false}
              />
            }
            onClick={() => handleClickLogo()}
          />
        </Space>
        {
          !collapsed && <p
            className='ml-1'
            style={{ color: gray[0] }}
          >
            {t('common.app_title')}
          </p>
        }
      </div>
      <DropdownMenu />
    </div>
  );
}

export default SidebarTop;

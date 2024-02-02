import React, { } from 'react';
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Space,
  Image,
  Button,
} from '@lockerpm/design';

import {
} from '@ant-design/icons'

import { gray } from '@ant-design/colors';

import layoutComponents from '../../../components/layout';

import images from '../../../assets/images';

import global from '../../../config/global';

import '../css/sidebar-top.scss';

const { DropdownMenu } = layoutComponents;
const { IconLogo } = images;

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

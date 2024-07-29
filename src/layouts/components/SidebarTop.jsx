import React, { } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Space,
  Image,
  Button,
} from '@lockerpm/design';

import {
} from '@ant-design/icons'

import layoutComponents from '../../components/layout';

import images from '../../assets/images';

import global from '../../config/global';

import '../css/sidebar-top.scss';

function SidebarTop(props) {
  const { DropdownMenu } = layoutComponents;
  const { IconLogo } = images;
  const { collapsed } = props
  const { t } = useTranslation();

  const isMobile = useSelector((state) => state.system.isMobile)

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
            className='ml-1 font-semibold text-primary cursor-pointer'
            onClick={() => handleClickLogo()}
          >
            {t('common.app_title')}
          </p>
        }
      </div>
      {
        !isMobile && <DropdownMenu />
      }
    </div>
  );
}

export default SidebarTop;

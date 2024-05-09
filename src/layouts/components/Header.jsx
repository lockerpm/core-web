import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Button,
  Space
} from '@lockerpm/design';

import {
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons';

import itemsComponents from '../../components/items';
import layoutComponents from '../../components/layout';

import '../css/header.scss';

function Header(props) {
  const { ImageIcon } = itemsComponents;
  const { Breadcrumb, SearchContent, Notifications, DropdownMenu } = layoutComponents;
  const { t } = useTranslation()
  const isMobile = useSelector((state) => state.system.isMobile);
  const [search, setSearch] = useState(false);
  const { collapsed, setCollapsed, setRespCollapsed } = props;

  document.addEventListener('click', (e) => {
    const searchContent = document.getElementById('search-content');
    const btnSearchContent = document.getElementById('btn-search-content');
    if (searchContent && !searchContent.contains(e.target) && btnSearchContent && !btnSearchContent.contains(e.target)) {
      setSearch(false)
    }
  })
  return (
    <div className={`${props.className} ${isMobile  ? 'mobile' : ''}`}>
      <div className='admin-layout-header__left flex items-center'>
        {
          isMobile && <div className='menu-toggle-icon' onClick={() => setRespCollapsed(false)}>
            <MenuOutlined style={{ fontSize: 20 }}/>
          </div>
        }
        {
          !isMobile && <div className='menu-toggle-icon mr-2' onClick={() => setCollapsed(!collapsed)}>
            <ImageIcon
              name={ collapsed ? 'expand-icon' : 'wrapper-icon' }
              className={'flex items-center'}
            />
          </div>
        }
        {
          !isMobile && <Breadcrumb />
        }
      </div>
      <div className='admin-layout-header__right flex items-center'>
        <Space size={[8, 8]}>
          <Button
            id="btn-search-content"
            shape="circle"
            disabled={search}
            icon={<SearchOutlined />}
            onClick={() => setSearch(true)}
          />
          <Notifications />
          {
            isMobile && <DropdownMenu />
          }
        </Space>
      </div>
      {
        search && <SearchContent
          className='admin-layout-header__search-content'
          onClose={() => setSearch(false)}
        />
      }
    </div>
  );
}

export default Header;

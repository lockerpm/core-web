import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Space
} from '@lockerpm/design';
import {
  SearchOutlined,
  MenuOutlined,
  BellOutlined
} from '@ant-design/icons';
import './css/Header.scss';

import Breadcrumb from './Breadcrumb';
import { ImageIcon } from '../../components'
import SearchContent from './components/SearchContent';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

function Header(props) {
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
            <ImageIcon name={ collapsed ? 'expand-icon' : 'wrapper-icon' }/>
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
          <Button
            shape="circle"
            icon={<BellOutlined />}
            onClick={() => {}}
          />
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

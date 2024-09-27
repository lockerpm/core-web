import React, { useMemo, useState, useEffect } from "react";
import {
  Button,
  Input,
  Dropdown,
} from '@lockerpm/design';

import {
  SearchOutlined,
  CaretDownOutlined,
  Sor
} from "@ant-design/icons";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from "../../../../config/global";

const Filter = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    params = {},
    loading = false,
    setParams = () => { }
  } = props;

  const locale = useSelector((state) => state.system.locale);
  const isMobile = useSelector((state) => state.system.isMobile);

  const [searchText, setSearchText] = useState(params.searchText)

  useEffect(() => {
    setSearchText(params.searchText)
  }, [params.searchText])

  const selectedSortOption = useMemo(() => {
    return global.constants.SORT_OPTIONS.find((o) =>
      o.orderField === params.orderField &&
      o.orderDirection === params.orderDirection
    )
  }, [params])

  const sortMenus = useMemo(() => {
    return global.constants.SORT_OPTIONS.map((o) => ({
      key: o.key,
      label: <p className={o.key === selectedSortOption?.key ? 'text-primary' : ''}>
        {t(o.label)}
      </p>,
      onClick: () => setParams({
        ...params,
        orderField: o.orderField,
        orderDirection: o.orderDirection
      })
    }))
  }, [selectedSortOption, params, locale])

  return (
    <div
      className={`filter ${className} flex items-center justify-between`}
      size={[0, 8]}
    >
      <Input
        className={`flex-1 max-w-[400px] mr-3 ${isMobile ? 'border' : ''}`}
        prefix={<SearchOutlined />}
        value={searchText}
        disabled={loading}
        placeholder={t('placeholder.search')}
        style={{ boxShadow: isMobile ? 'none' : '' }}
        onChange={(e) => {
          setSearchText(e.target.value)
          setParams({
            ...params,
            searchText: e.target.value
          })
        }}
        onPressEnter={() => setParams({ ...params, searchText })}
      />
      <div>
        {
          isMobile ? <Dropdown
            trigger={['click']}
            disabled={loading}
            menu={{
              items: sortMenus,
              selectedKeys: []
            }}
          >
            <Button
              style={{ boxShadow: 'none' }}
              icon={<CaretDownOutlined />}
            />
          </Dropdown> : <Dropdown.Button
            icon={<CaretDownOutlined />}
            trigger={['click']}
            disabled={loading}
            menu={{
              items: sortMenus,
              selectedKeys: []
            }}
          >
            {t('sort_options.sort_by')}
          </Dropdown.Button>
        }
      </div>
    </div>
  );
}

export default Filter;

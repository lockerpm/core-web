import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Input,
  Dropdown,
  Space,
  Radio
} from '@lockerpm/design';

import {
  SearchOutlined,
  CaretDownOutlined,
  LockOutlined,
  FolderOutlined
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
    menuType = null,
    menuTypes = null,
    setMenuType = () => {},
    setParams = () => { }
  } = props;

  const [filterTimeout, setFilterTimeout] = useState(null)
  const [searchText, setSearchText] = useState(params.searchText)

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
        {o.label}
      </p>,
      onClick: () => setParams({
        ...params,
        orderField: o.orderField,
        orderDirection: o.orderDirection
      })
    }))
  }, [selectedSortOption, params])

  return (
    <Row
      className={`filter ${className}`}
      justify={'space-between'}
      gutter={[0, 8]}
    >
      <Col lg={12} span={12} className="w-full">
        <Space className="w-full">
          {
            menuType && <Radio.Group
              value={menuType}
              disabled={loading}
              onChange={e => setMenuType(e.target.value)}
            >
              <Radio.Button value={menuTypes.CIPHERS}>
                <LockOutlined />
                <span className="ml-2">{t('common.items')}</span>
              </Radio.Button>
              <Radio.Button value={menuTypes.FOLDERS}>
                <FolderOutlined />
                <span className="ml-2">{t('common.folders')}</span>
              </Radio.Button>
            </Radio.Group>
          }
          <Input
            prefix={<SearchOutlined />}
            value={searchText}
            disabled={loading}
            placeholder={t('placeholder.search')}
            onChange={(e) => {
              if (filterTimeout) {
                clearTimeout(filterTimeout)
              }
              setSearchText(e.target.value)
              setFilterTimeout(setTimeout(() => {
                setParams({
                  ...params,
                  searchText: e.target.value
                })
              }, 500))
            }}
            onPressEnter={() => setParams({ ...params, searchText })}
          />
        </Space>
      </Col>
      <Col lg={12} span={12} className="w-full">
        <Row
          justify={'end'}
          gutter={[12, 12]}
        >
          <Col>
            <Dropdown.Button
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
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Filter;

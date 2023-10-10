import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
} from '@lockerpm/design';

import {
  SearchOutlined
} from "@ant-design/icons";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

const Filter = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    params = {},
    setParams = () => { }
  } = props;

  const [filterTimeout, setFilterTimeout] = useState(null)
  const [searchText, setSearchText] = useState(params.searchText)

  return (
    <Row
      className={`filter ${className}`}
      justify={'space-between'}
      gutter={[0, 8]}
    >
      <Col lg={24} className="w-full">
        <Row
          justify={'left'}
          gutter={[12, 12]}
        >
          <Col xl={8} lg={8} md={12} xs={24}>
            <Input
              prefix={<SearchOutlined />}
              value={searchText}
              placeholder={t('placeholder.search')}
              onChange={(e) => {
                if (filterTimeout) {
                  clearTimeout(filterTimeout)
                }
                setSearchText(e.target.value)
                setFilterTimeout(setTimeout(() => {
                  setParams({ ...params, searchText: e.target.value })
                }, 500))
              }}
              onPressEnter={() => setParams({ ...params, searchText })}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Filter;

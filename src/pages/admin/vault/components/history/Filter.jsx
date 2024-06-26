import React, { useMemo } from "react";
import {
  Row,
  Col,
  Dropdown,
} from '@lockerpm/design';

import {
  CaretDownOutlined
} from "@ant-design/icons";

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import global from "../../../../../config/global";

const Filter = (props) => {
  const { t } = useTranslation()
  const {
    className = '',
    params = {},
    loading = false,
    setParams = () => { }
  } = props;

  const locale = useSelector((state) => state.system.locale);

  const selectedSortOption = useMemo(() => {
    return global.constants.SORT_OPTIONS.find((o) =>
      o.orderField === params.orderField &&
      o.orderDirection === params.orderDirection
    )
  }, [params])

  const sortMenus = useMemo(() => {
    return global.constants.SORT_OPTIONS.filter((o) => o.orderField !== 'name').map((o) => ({
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
    <Row
      className={`filter ${className}`}
      justify={'space-between'}
      gutter={[0, 8]}
    >
      <Col lg={12} span={12} className="w-full">
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

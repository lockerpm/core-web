import React from "react";
import {
  Row,
  Col,
  Input,
  Select,
  DatePicker
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
    environments = [],
    setParams = () => { }
  } = props;


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
          <Col xl={4} lg={6} md={8} xs={12}>
            <p className="font-semibold mb-1">{t('secret.key')}</p>
            <Input
              prefix={<SearchOutlined />}
              value={params.key}
              placeholder={t('placeholder.enter')}
              onChange={(e) => setParams({ ...params, key: e.target.value })}
            />
          </Col>
          <Col xl={4} lg={6} md={8} xs={12}>
            <p className="font-semibold mb-1">{t('secret.environment')}</p>
            <Select
              placeholder={t('placeholder.select')}
              className="w-full"
              value={params.environmentId}
              allowClear
              onChange={(v) => setParams({ ...params, environmentId: v })}
            >
              <Select.Option
                value={''}
                key={'all'}
              >
                {t('common.all_default')}
              </Select.Option>
              {environments.map((env) => (
                <Select.Option
                  value={env.id}
                  key={env.id}
                >
                  {env.environment.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Filter;

import React, { useEffect, useState, useMemo } from "react";
import {
  Row,
  Col,
} from '@lockerpm/design';
import {
} from "@ant-design/icons";

import components from "../../../components";
import AdoptionRate from "./components/dashboard/AdoptionRate";
import News from "./components/dashboard/News";
import UserLoginByTime from "./components/dashboard/UserLoginsByTime";
import PasswordSecurity from "./components/dashboard/PasswordSecurity";
import UsersBlocked from "./components/dashboard/UsersBlocked";

import { } from 'react-redux';
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import common from "../../../utils/common";
import enterpriseServices from "../../../services/enterprise";

import dayjs from 'dayjs'

const EnterpriseDashboard = (props) => {
  const { PageHeader, FilterTime }= components;
  const { } = props;
  const { t } = useTranslation();
  const location = useLocation();

  const currentPage = common.getRouterByLocation(location)
  const enterpriseId = currentPage?.params.enterprise_id

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [params, setParams] = useState({
    type: 'all',
    time_option: 'all_time',
    dates: [],
  });

  const payload = useMemo(() => {
    setData({})
    if (params.dates?.length > 0) {
      return {
        from: params.dates[0] ? dayjs(params.dates[0]).unix() : '',
        to: params.dates[0] ? dayjs(params.dates[1]).unix() : '',
      }
    }
    return {}
  }, [params])


  useEffect(() => {
    fetchData();
  }, [payload])

  const fetchData = async () => {
    setLoading(true);
    await enterpriseServices.dashboard(enterpriseId, payload).then((response) => {
      setData(response);
    }).catch(() => {
      setData({});
    });
    setLoading(false);
  }

  return (
    <div className="enterprise_dashboard layout-content">
      <PageHeader
        title={t('enterprise_dashboard.title')}
        actions={[]}
        Right={() => <FilterTime
          params={params}
          onChange={(v) => setParams({ ...params, ...v })}
        />}
      />
      <Row gutter={[24, 24]} className="mt-2">
        <Col lg={12} md={24} sm={24} xs={24}>
          <AdoptionRate
            loading={loading}
            data={data}
          />
        </Col>
        <Col lg={12} md={24} sm={24} xs={24}>
          <News
            loading={loading}
            data={data}
          />
        </Col>
        <Col span={24}>
          <UserLoginByTime
            loading={loading}
            data={data}
          />
        </Col>
        <Col lg={12} md={24} sm={24} xs={24}>
          <PasswordSecurity
            loading={loading}
            data={data}
          />
        </Col>
        <Col lg={12} md={24} sm={24} xs={24}>
          <UsersBlocked
            loading={loading}
            data={data}
            enterpriseId={enterpriseId}
          />
        </Col>
      </Row>
    </div>
  );
}

export default EnterpriseDashboard; 
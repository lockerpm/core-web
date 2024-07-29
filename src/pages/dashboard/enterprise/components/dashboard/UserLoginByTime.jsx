import React, { useMemo } from "react";
import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import {
  Card,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { green } from '@ant-design/colors';

import chartComponents from "../../../../../components/chart";

const UserLoginByTime = (props) => {
  const { Line } = chartComponents;
  const {
    loading = false,
    data = {},
  } = props;

  const { t } = useTranslation();

  const chartData = useMemo(() => {
    const d = data.login_statistic || {}
    return Object.keys(data.login_statistic || {}).map((key) => {
      return {
        value: d[key] || 0,
        key: key
      }
    });
  }, [data])

  const series = useMemo(() => {
    return [
      {
        name: t('enterprise_dashboard.user_login.user'),
        data: chartData.map((p) => p.value)
      }
    ]
  }, [chartData])

  return (
    <Card
      loading={loading}
      title={false}
      className="h-full"
    >
      <p className="font-semibold text-black-500 mb-2 text-xl">
        {t('enterprise_dashboard.user_login.title')}
      </p>
      <Line
        colors={[green[6]]}
        categories={chartData.map((p) => p.key)}
        series={series}
      />
    </Card>
  );
}

export default UserLoginByTime;
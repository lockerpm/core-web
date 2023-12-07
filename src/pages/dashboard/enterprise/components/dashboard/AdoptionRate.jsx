import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
} from '@lockerpm/design';

import { RouterLink } from "../../../../../components";

import {
} from "@ant-design/icons";

import { } from 'react-redux';
import { useTranslation } from "react-i18next";

import DonutChart from './charts/Donut';
import { blue, green, orange } from '@ant-design/colors';

const AdoptionRate = (props) => {
  const {
    loading = false,
    data = {}
  } = props;

  const { t } = useTranslation();

  const series = useMemo(() => {
    return [
      data?.members?.status?.confirmed || 0,
      data?.members?.status?.requested || 0,
      data?.members?.status?.invited || 0,
    ]
  }, [data])

  return (
    <Card
      loading={loading}
      title={false}
      hoverable={false}
      className="h-full"
    >
      <p className="font-semibold text-gray mb-2 text-xl">
        {t('enterprise_dashboard.adoption_rate.title')}
      </p>
      <DonutChart
        height={250}
        type="pie"
        colors={[
          blue[6],
          orange[6],
          green[6]
        ]}
        categories={[
          t('enterprise_dashboard.adoption_rate.confirmed'),
          t('enterprise_dashboard.adoption_rate.requested'),
          t('enterprise_dashboard.adoption_rate.invited')
        ]}
        series={series}
      />
      <div className="mt-4 flex">
        <p className="font-semibold text-center flex-1">
          {t('enterprise_dashboard.adoption_rate.total')}: {data?.members?.total}
        </p>
        <p className="font-semibold text-center text-primary cursor-pointer" style={{ width: 200 }}>
          {t('enterprise_dashboard.adoption_rate.manage_pending_members')}
        </p>
      </div>
    </Card>
  );
}

export default AdoptionRate;
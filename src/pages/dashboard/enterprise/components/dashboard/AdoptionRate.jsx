import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Card,
} from '@lockerpm/design';

import {
  blue,
  green,
  orange
} from '@ant-design/colors';

import chartComponents from "../../../../../components/chart";

const AdoptionRate = (props) => {
  const { Donut } = chartComponents;
  const {
    loading = false,
    data = {}
  } = props;

  const { t } = useTranslation();

  const series = useMemo(() => {
    return [
      data?.members?.status?.accessed || 0,
      data?.members?.status?.created || 0,
    ]
  }, [data])

  return (
    <Card
      loading={loading}
      title={false}
      hoverable={false}
      className="h-full"
    >
      <p className="font-semibold text-black-500 mb-2 text-xl">
        {t('enterprise_dashboard.adoption_rate.title')}
      </p>
      <Donut
        height={250}
        type="pie"
        colors={[
          blue[6],
          orange[6],
          green[6]
        ]}
        categories={[
          t('enterprise_dashboard.adoption_rate.accessed'),
          t('enterprise_dashboard.adoption_rate.created')
        ]}
        series={series}
      />
      <div className="mt-4 flex">
        <p className="font-semibold text-center flex-1">
          {t('enterprise_dashboard.adoption_rate.total')}: {data?.members?.total}
        </p>
        <p className="font-semibold text-center text-primary cursor-pointer" style={{ width: 200 }}>
        </p>
      </div>
    </Card>
  );
}

export default AdoptionRate;
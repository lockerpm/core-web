import React, { useMemo } from "react";

import {
} from "@ant-design/icons";

import { } from 'react-redux';
import Chart from "react-apexcharts";

import common from "../../utils/common";

const Donut = (props) => {
  const {
    height = 200,
    colors = [],
    series = [],
    categories = [],
    type = 'donut'
  } = props;

  const chartData = useMemo(() => {
    return {
      options: {
        legend: {
          position: 'right',
          horizontalAlign: 'center',
          width: 200,
        },
        dataLabels: {
          enabled: false
        },
        labels: categories,
        colors: colors,
        tooltip: {
          y: {
            formatter: (v) => {
              return common.separatorNumber(v)
            }
          }
        },
      },
      series: series,
    }
  }, [series, categories])

  return (
    <Chart
      height={height}
      options={chartData.options}
      series={chartData.series}
      type={type}
    />
  );
}

export default Donut;
import React, { useMemo } from "react";

import {
} from "@ant-design/icons";

import Chart from "react-apexcharts";

import { } from 'react-redux';

import common from "../../utils/common";

const Line = (props) => {
  const {
    height = 400,
    colors = [],
    series = [],
    categories = [],
    borderRadius = 0
  } = props;

  const chartData = useMemo(() => {
    return {
      options: {
        chart: {
          type: 'line',
          toolbar: {
            show: false
          }
        },
        colors: colors,
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 3,
          curve: 'straight',
          colors: colors
        },
        xaxis: {
          categories: categories,
          labels: {
            show: true
          }
        },
        yaxis: {
          title: {
            text: undefined
          },
          labels: {
            formatter: (v) => {
              return v
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'right',
          offsetX: 40
        },
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
  }, [series, categories, colors, borderRadius])

  return (
    <div>
      {
        series.length > 0 && categories.length > 0 && <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={height}
        />
      }
    </div>
  );
}

export default Line;
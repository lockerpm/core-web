import React, { } from "react";
import {
  Image,
  Spin
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { } from 'react-redux';

const NoData = (props) => {
  const {
    loading = false,
    className = ''
  } = props;
  return (
    <Spin spinning={loading}>
      <div
        className={`text-center ${className}`}
      >
        <Image
          src={require('../../assets/images/data/no-data.svg').default}
          preview={false}
        />
      </div>
    </Spin>
  );
}

export default NoData;
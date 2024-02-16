import React, { } from "react";
import { } from 'react-redux';

import {
  Image,
  Spin
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import images from "../../assets/images";
const { NoDataImg } = images;

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
          src={NoDataImg}
          preview={false}
        />
      </div>
    </Spin>
  );
}

export default NoData;
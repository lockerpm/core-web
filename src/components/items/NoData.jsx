import React from "react";
import {
  Image,
  Spin
} from '@lockerpm/design';

import images from "../../assets/images";

const NoData = (props) => {
  const { NoDataImg } = images;
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
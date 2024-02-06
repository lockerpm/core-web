import React, { } from "react";
import { } from 'react-redux';

import {
  Image,
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

const ImageIcon = (props) => {
  const {
    className = '',
    name = '',
    width = 20,
    height = 20,
    title = ''
  } = props;

  const Icon = require(`../../assets/images/icons/${name}.svg`)

  return (
    <span className="image-icon" title={title}>
      <Image
        className={className}
        style={{ width: width, height: height }}
        preview={false}
        src={Icon}
      />
    </span>
  );
}

export default ImageIcon;
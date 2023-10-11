import React, { } from "react";
import {
  Image,
} from '@lockerpm/design';


import {
} from "@ant-design/icons";

import { } from 'react-redux';

const ImageIcon = (props) => {
  const {
    name = '',
    width = 20,
    height = 20
  } = props;

  const Icon = require(`../../assets/images/icons/${name}.svg`)

  return (
    <div className="image-icon">
      <Image
        style={{ width: width, height: height }}
        preview={false}
        src={Icon}
      />
    </div>
  );
}

export default ImageIcon;
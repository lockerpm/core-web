import React, { } from "react";

import {
  Image
} from '@lockerpm/design';

import { } from 'react-redux';
import { } from "react-i18next";

import {
} from "@ant-design/icons";

import images from "../../../assets/images";

const { AuthLogo } = images;

const Logo = (props) => {
  const {
  } = props;
  return (
    <div className="flex items-center justify-center mb-8">
      <Image
        className='icon-logo'
        src={AuthLogo}
        preview={false}
        height={48}
      />
    </div>
  );
}

export default Logo;
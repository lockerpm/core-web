import React, { } from 'react';
import { useSelector } from 'react-redux';
import { } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from '@ant-design/icons'

import {
} from '@ant-design/colors';

function Other(props) {
  const isMobile = useSelector((state) => state.system.isMobile);

  return (
    <div className={`${props.className} ${isMobile  ? 'mobile' : ''}`}>
    </div>
  );
}

export default Other;

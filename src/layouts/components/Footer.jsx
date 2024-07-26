import React, { } from 'react';
import { } from 'react-redux';
import { } from "react-i18next";

import {
} from '@lockerpm/design';

import {
} from '@ant-design/icons'

import {
} from '@ant-design/colors';

import '../css/footer.scss';

function Footer(props) {
  const { showFooter } = props;
  return (
    <>
      {
        showFooter && <div className={`${props.className}`}></div>
      }
    </>
  );
}

export default Footer;

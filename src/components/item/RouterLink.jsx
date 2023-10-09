import React, { } from "react";
import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import { } from 'react-redux';
import { Link } from "react-router-dom";

import {
  convertQueryToString,
  getRouterByName,
  getRouterParams,
} from '../../utils/common'


const RouterLink = (props) => {
  const {
    className = '',
    routerName = '',
    routerParams = {},
    routerQuery = {},
    label = '',
    blank = false,
    maxWidth = '100%',
  } = props;

  const currentRouter = getRouterByName(routerName)
  const newPath = convertQueryToString(getRouterParams(currentRouter.path, routerParams), routerQuery)
  return (
    <Link
      className={`cs-link ${className} text-primary text-limited`}
      style={{ maxWidth: maxWidth, flex: 1 }}
      target={blank ? '_blank' : ''}
      to={newPath}
      title={label}
    >
      {label}
    </Link>
  );
}

export default RouterLink;
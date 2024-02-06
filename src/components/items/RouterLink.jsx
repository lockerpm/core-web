import React, { } from "react";
import { } from 'react-redux';
import { Link } from "react-router-dom";

import {
} from '@lockerpm/design';

import {
} from "@ant-design/icons";

import common from "../../utils/common";

const RouterLink = (props) => {
  const {
    className = '',
    routerName = '',
    routerParams = {},
    routerQuery = {},
    label = '',
    blank = false,
    maxWidth = '100%',
    icon = <></>
  } = props;

  const currentRouter = common.getRouterByName(routerName)
  const newPath = currentRouter ? common.convertQueryToString(
    common.getRouterParams(currentRouter?.path, routerParams),
    routerQuery
  ) : '/'
  return (
    <Link
      className={`cs-link ${className} text-primary text-limited`}
      style={{ maxWidth: maxWidth, flex: 1 }}
      target={blank ? '_blank' : ''}
      to={newPath}
    >
      <span title={label}>{label}</span> {icon}
    </Link>
  );
}

export default RouterLink;